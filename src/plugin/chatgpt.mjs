import { inspect } from 'util';
import { pick } from 'lodash-es';
import AxiosProxy from '../utils/axiosProxy.mjs';
import { DailyCount } from '../utils/dailyCount.mjs';
import emitter from '../utils/emitter.mjs';
import { retryAsync } from '../utils/retry.mjs';

const dailyCount = new DailyCount();

let overrideGroups = [];

emitter.onConfigLoad(() => {
  overrideGroups = global.config.bot.chatgpt.overrides.map(({ blackGroup, whiteGroup }) => {
    const override = {};
    if (blackGroup) override.blackGroup = new Set(blackGroup);
    if (whiteGroup) override.whiteGroup = new Set(whiteGroup);
    return override;
  });
});

const getMatchAndConfig = text => {
  const globalConfig = global.config.bot.chatgpt;
  let match;
  const overrideConfigIndex = globalConfig.overrides.findIndex(
    config => config?.regexp && (match = new RegExp(config.regexp).exec(text))
  );
  const overrideConfig = globalConfig.overrides[overrideConfigIndex];

  if (!overrideConfig) {
    match = new RegExp(globalConfig.regexp).exec(text);
  }

  return {
    match,
    config: pick(
      overrideConfig
        ? {
            ...globalConfig,
            ...overrideConfig,
            ...overrideGroups[overrideConfigIndex],
          }
        : globalConfig,
      [
        'model',
        'useChatAPI',
        'maxTokens',
        'prependMessages',
        'additionParams',
        'apiKey',
        'organization',
        'blackGroup',
        'whiteGroup',
      ]
    ),
  };
};

const getRequestHeaders = config => {
  const headers = {
    Authorization: `Bearer ${config.apiKey}`,
  };
  if (config.organization) headers['OpenAI-Organization'] = config.organization;
  return headers;
};

const callCompletionAPI = (prompt, config) => {
  const headers = getRequestHeaders(config);
  let { maxTokens } = config;

  return retryAsync(async () => {
    const { debug } = global.config.bot;
    const params = {
      ...config.additionParams,
      model: config.model,
      max_tokens: maxTokens || undefined,
      prompt,
    };
    if (debug) console.log('[chatgpt] params:', inspect(params, { depth: null }));

    const { data } = await AxiosProxy.post('https://api.openai.com/v1/completions', params, {
      headers,
      validateStatus: status => 200 <= status && status < 500,
    });
    if (debug) console.log('[chatgpt] response:', inspect(data, { depth: null }));

    if (data.error) {
      const errorMsg = data.error.message;
      const tokenErrorReg = /maximum context length is (\d+) tokens.+?(\d+) in your prompt/;
      const tokenErrorMatch = tokenErrorReg.exec(errorMsg);

      if (tokenErrorMatch) {
        const modelMaxTokens = Number(tokenErrorMatch[1]);
        const promptTokens = Number(tokenErrorMatch[2]);

        if (maxTokens >= modelMaxTokens) {
          console.error('[chatgpt] error:', errorMsg);
          return `模型 ${config.model} 最大 token 数量为 ${modelMaxTokens}，maxToken 配置已超过该值，请调整`;
        }

        maxTokens = modelMaxTokens - promptTokens - 1;
        if (debug) console.log('[chatgpt] adjust max_tokens to', maxTokens, 'and retry');
        throw new Error(errorMsg); // 触发重试
      }

      console.error('[chatgpt] error:', errorMsg);
      return `ERROR: ${errorMsg}`;
    }

    if (data.choices?.length) {
      const { text } = data.choices[0];
      return text.replace(/^.\n\n/, '').trim();
    }

    console.log('[chatgpt] unexpected response:', data);
    return 'ERROR: 无回答';
  }).catch(e => `ERROR: ${e.message}`);
};

const callChatAPI = (prompt, config) => {
  const headers = getRequestHeaders(config);

  return retryAsync(async () => {
    const { debug } = global.config.bot;
    const params = {
      ...config.additionParams,
      model: config.model,
      max_tokens: config.maxTokens || undefined,
      messages: [
        ...(Array.isArray(config.prependMessages) ? config.prependMessages : []),
        { role: 'user', content: prompt },
      ],
    };
    if (debug) console.log('[chatgpt] params:', inspect(params, { depth: null }));

    const { data } = await AxiosProxy.post('https://api.openai.com/v1/chat/completions', params, {
      headers,
      validateStatus: status => 200 <= status && status < 500,
    });
    if (debug) console.log('[chatgpt] response:', inspect(data, { depth: null }));

    if (data.error) {
      const errorMsg = data.error.message;
      console.error('[chatgpt] error:', errorMsg);
      return `ERROR: ${errorMsg}`;
    }

    const text = data.choices?.[0]?.message?.content;
    if (text) return text.replace(/^.\n\n/, '').trim();

    console.log('[chatgpt] unexpected response:', data);
    return 'ERROR: 无回答';
  }).catch(e => `ERROR: ${e.message}`);
};

export default async context => {
  const { match, config } = getMatchAndConfig(context.message);

  if (!match) return false;

  if (context.group_id) {
    const { blackGroup, whiteGroup } = config;
    if (blackGroup.has(context.group_id)) return true;
    if (whiteGroup.size && !whiteGroup.has(context.group_id)) return true;
  }

  if (!config.apiKey) {
    global.replyMsg(context, '未配置 APIKey', false, true);
    return true;
  }

  const prompt = match[1]?.replace(/\[CQ:[^\]]+\]/g, '').trim();
  if (!prompt) return true;

  const { userDailyLimit } = global.config.bot.chatgpt;
  if (userDailyLimit) {
    if (dailyCount.get(context.user_id) >= userDailyLimit) {
      global.replyMsg(context, '今天玩的够多啦，明天再来吧！', false, true);
      return true;
    } else dailyCount.add(context.user_id);
  }

  if (global.config.bot.debug) console.log('[chatgpt] prompt:', prompt);

  const completion = config.useChatAPI ? await callChatAPI(prompt, config) : await callCompletionAPI(prompt, config);

  global.replyMsg(context, completion, false, true);

  return true;
};
