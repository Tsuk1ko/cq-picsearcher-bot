import _ from 'lodash';
import CQ from './CQcode';

const getKey = (img, db) => `${img.file}.${db}`;

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

    return {
      reply: async (...msgs) => {
        _.remove(msgs, msg => !msg);
        allMsgs.push(...msgs);

        const { groupForwardSearchResult, privateForwardSearchResult } = global.config.bot;
        if (privateForwardSearchResult && isPrivateCtx(mainCtx)) return;
        if (groupForwardSearchResult && isGroupCtx(mainCtx)) return;

        const promise = global.replySearchMsgs(mainCtx, msgs);
        mainPromises.push(promise);
        return promise;
      },
      end: async ({ file }) => {
        await Promise.all(mainPromises);
        super.delete(key);

        const { groupForwardSearchResult, privateForwardSearchResult, pmSearchResult, pmSearchResultTemp } =
          global.config.bot;
        const isMainCtxRelied = !(
          (privateForwardSearchResult && isPrivateCtx(mainCtx)) ||
          (groupForwardSearchResult && isGroupCtx(mainCtx))
        );

        const restCtxs = isMainCtxRelied ? _.tail(ctxs) : ctxs;
        const privateForwardCtxs =
          allMsgs.length > 1 && privateForwardSearchResult ? _.remove(restCtxs, ctx => isPrivateCtx(ctx)) : [];
        const groupForwardCtxs =
          allMsgs.length > 1 && groupForwardSearchResult ? _.remove(restCtxs, ctx => isGroupCtx(ctx)) : [];

        for (const [ctxs, replyFunc] of [
          [privateForwardCtxs, global.replyPrivateForwardMsgs],
          [
            groupForwardCtxs,
            pmSearchResult && !pmSearchResultTemp
              ? privateForwardSearchResult
                ? global.replyPrivateForwardMsgs
                : global.replySearchMsgs
              : global.replyGroupForwardMsgs,
          ],
          [restCtxs, global.replySearchMsgs],
        ]) {
          for (const ctx of ctxs) {
            try {
              await replyFunc(ctx, allMsgs, [CQ.img(file)]);
            } catch (e) {}
          }
        }
      },
    };
  }
}

export default Object.assign(new SearchingMap(), PUT_RETURN);
