import { pick } from 'lodash-es';
import AxiosProxy from '../utils/axiosProxy.mjs';
import emitter from '../utils/emitter.mjs';
import { retryAsync } from '../utils/retry.mjs';

let blackGroup = new Set();
let whiteGroup = new Set();

emitter.onConfigLoad(() => {
  blackGroup = new Set(global.config.bot.chatgpt.blackGroup);
  whiteGroup = new Set(global.config.bot.chatgpt.whiteGroup);
});

const getMatchAndConfig = text => {
  const globalConfig = global.config.bot.chatgpt;
  let match;
  const overrideConfig = globalConfig.overrides.find(
    config => config?.regexp && (match = new RegExp(config.regexp).exec(text))
  );

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
          }
        : globalConfig,
      ['model', 'maxTokens', 'additionParams', 'apiKey', 'organization']
    ),
  };
};

export default async context => {
  if (context.group_id) {
    if (blackGroup.has(context.group_id)) return false;
    if (whiteGroup.size && !whiteGroup.has(context.group_id)) return false;
  }

  const { match, config } = getMatchAndConfig(context.message);

  if (!match) return false;
  if (!config.apiKey) {
    global.replyMsg(context, '未配置 APIKey', false, true);
    return false;
  }

  const prompt = match[1]?.replace(/\[CQ:[^\]]+\]/g, '').trim();
  if (!prompt) return false;

  const { debug } = global.config.bot;
  if (debug) console.log('[chatgpt] prompt:', prompt);

  let { maxTokens } = config;
  const headers = {
    Authorization: `Bearer ${config.apiKey}`,
  };
  if (config.organization) headers['OpenAI-Organization'] = config.organization;

  const completion = await retryAsync(async () => {
    const params = {
      ...config.additionParams,
      model: config.model,
      max_tokens: maxTokens,
      prompt,
    };
    if (debug) console.log('[chatgpt] params:', params);

    const { data } = await AxiosProxy.post('https://api.openai.com/v1/completions', params, {
      headers,
      validateStatus: status => 200 <= status && status < 500,
    });
    if (debug) console.log('[chatgpt] response:', data);

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

  global.replyMsg(context, completion, false, true);

  return true;
};
