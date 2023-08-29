import _ from 'lodash-es';
import CQ from '../utils/CQcode.mjs';

const handleFileUrl = (origUrl, file) => {
  const url = new URL(origUrl);
  url.searchParams.set('fname', file.file_name);
  return url.href.replace(/\+/g, '%20');
};

export default async ctx => {
  if (ctx.message_type !== 'group') return false;
  const search = /^--get-group-file=(.+)/.exec(ctx.message);
  if (!search) return false;

  const paths = String(CQ.unescape(search[1])).split('/');
  if (!paths.length || paths.length > 2) {
    global.replyMsg(ctx, '路径不正确', false, true);
    return true;
  }

  let { data: dir } = await global.bot('get_group_root_files', { group_id: ctx.group_id });
  let name = paths[0];

  if (paths.length > 1) {
    const folder = dir.folders.find(({ folder_name }) => folder_name === name);
    if (!folder) {
      global.replyMsg(ctx, `文件夹 ${CQ.escape(name)} 不存在`, false, true);
      return true;
    }

    const { data } = await global.bot('get_group_files_by_folder', {
      group_id: ctx.group_id,
      folder_id: folder.folder_id,
    });
    dir = data;
    name = paths[1];
  }

  const file = dir.files.find(({ file_name }) => file_name === name);
  if (!file) {
    global.replyMsg(ctx, `文件 ${CQ.escape(name)} 不存在`, false, true);
    return true;
  }

  const { data } = await global.bot('get_group_file_url', {
    group_id: ctx.group_id,
    ..._.pick(file, ['file_id', 'busid']),
  });
  global.replyMsg(ctx, data ? CQ.escape(handleFileUrl(data.url, file)) : '该文件已失效', false, true);

  return true;
};
