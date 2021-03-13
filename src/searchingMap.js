import _ from 'lodash';
import asyncMap from './utils/asyncMap';

const getKey = (img, db) => `${img.file}.${db}`;

const CTX_COMPARE_KEY = {
  private: 'user_id',
  group: 'group_id',
  discuss: 'discuss_id',
};
const isEqualCtx = (a, b) => {
  if (a.message_type !== b.message_type) return false;
  return a[CTX_COMPARE_KEY[a.message_type]] === b[CTX_COMPARE_KEY[b.message_type]];
};

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
        if (global.config.bot.groupForwardSearchResult && mainCtx.message_type === 'group') return;
        const promise = global.replySearchMsgs(mainCtx, ...msgs);
        mainPromises.push(promise);
        return promise;
      },
      end: async () => {
        await Promise.all(mainPromises);
        super.delete(key);
        if (global.config.bot.groupForwardSearchResult) {
          return asyncMap(mainCtx.message_type === 'group' ? ctxs : _.tail(ctxs), ctx => {
            if (allMsgs.length > 1 && ctx.message_type === 'group') {
              return global.sendGroupForwardMsg(ctx.group_id, allMsgs);
            }
            return global.replySearchMsgs(ctx, ...allMsgs);
          });
        }
        return asyncMap(_.tail(ctxs), ctx => global.replySearchMsgs(ctx, ...allMsgs));
      },
    };
  }
}

export default Object.assign(new SearchingMap(), PUT_RETURN);
