import _ from 'lodash-es';

const getKey = (img, db) => `${img.key || img.file}.${db}`;

const CTX_COMPARE_KEY = {
  private: 'user_id',
  group: 'group_id',
  discuss: 'discuss_id',
  guild: 'group_id',
};
const isEqualCtx = (a, b) => {
  if (a.message_type !== b.message_type) return false;
  return a[CTX_COMPARE_KEY[a.message_type]] === b[CTX_COMPARE_KEY[b.message_type]];
};
const isPrivateCtx = ctx => ctx.message_type === 'private';
const isGroupCtx = ctx => ctx.message_type === 'group';

const PUT_RETURN = {
  IS_SEARCHING: Symbol('在搜了'),
  IS_FIRST: Symbol('第一个搜的'),
  NOT_FIRST: Symbol('不是第一个搜的'),
};

class SearchingMap extends Map {
  put(img, db, ctx) {
    const ctxs = (() => {
      const key = getKey(img, db);
      if (super.has(key)) return super.get(key);
      const arr = [];
      super.set(key, arr);
      return arr;
    })();
    if (ctxs.some(_ctx => isEqualCtx(_ctx, ctx))) return PUT_RETURN.IS_SEARCHING;
    return ctxs.push(ctx) > 1 ? PUT_RETURN.NOT_FIRST : PUT_RETURN.IS_FIRST;
  }

  getReplier(img, db) {
    const key = getKey(img, db);
    const ctxs = super.get(key);
    if (!ctxs) throw new Error('no ctxs');

    const mainCtx = _.head(ctxs);
    const mainPromises = [];
    const allMsgs = [];

    const { groupForwardSearchResult, privateForwardSearchResult, pmSearchResult, pmSearchResultTemp } =
      global.config.bot;
    const needGroupForward =
      (privateForwardSearchResult && (isPrivateCtx(mainCtx) || (pmSearchResult && !pmSearchResultTemp))) ||
      (groupForwardSearchResult && isGroupCtx(mainCtx));

    return {
      reply: async (...msgs) => {
        _.remove(msgs, msg => !msg);
        allMsgs.push(...msgs);

        if (needGroupForward) return;

        const promise = global.replySearchMsgs(mainCtx, msgs, undefined, {
          groupForwardSearchResult,
          privateForwardSearchResult,
          pmSearchResult,
          pmSearchResultTemp,
        });
        mainPromises.push(promise);
        return promise;
      },
      end: async img => {
        await Promise.all(mainPromises);
        super.delete(key);

        const restCtxs = needGroupForward ? ctxs : _.tail(ctxs);
        const antiShieldingMode = global.config.bot.antiShielding;
        const cqImg = antiShieldingMode > 0 ? await img.getAntiShieldedCqImg64(antiShieldingMode) : img.toCQ();

        for (const ctx of restCtxs) {
          try {
            await global.replySearchMsgs(ctx, allMsgs, [cqImg], {
              groupForwardSearchResult,
              privateForwardSearchResult,
              pmSearchResult,
              pmSearchResultTemp,
            });
          } catch (e) {}
        }
      },
    };
  }
}

export default Object.assign(new SearchingMap(), PUT_RETURN);
