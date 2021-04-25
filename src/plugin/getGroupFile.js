import _ from 'lodash';

const handleFileUrl = (origUrl, file) => {
  const url = new URL(origUrl);
  url.searchParams.set('fname', file.file_name);
  return url.href.replace(/\+/g, '%20');
};

export default async ctx => {
  const search = /^--get-group-file=(.+)/.exec(ctx.message);
  if (!search) return false;

  const paths = String(search[1]).split('/');
  if (!paths.length || paths.length > 2) {
    global.replyMsg(ctx, '路径不正确', false, true);
    return true;
  }

  const { data: root } = await global.bot('get_group_root_files', { group_id: ctx.group_id });
  if (paths.length === 1) {
    const file = root.files.find(({ file_name }) => file_name === paths[0]);
    if (!file) {
      global.replyMsg(ctx, `文件 ${paths[0]} 不存在`, false, true);
      return true;
    }

    const {
      data: { url },
    } = await global.bot('get_group_file_url', {
      group_id: ctx.group_id,
      ..._.pick(file, ['file_id', 'busid']),
    });
    global.replyMsg(ctx, handleFileUrl(url, file), false, true);
  } else {
    const folder = root.folders.find(({ folder_name }) => folder_name === paths[0]);
    if (!folder) {
      global.replyMsg(ctx, `文件夹 ${paths[0]} 不存在`, false, true);
      return true;
    }

    const { data: dir } = await global.bot('get_group_files_by_folder', {
      group_id: ctx.group_id,
      folder_id: folder.folder_id,
    });

    const file = dir.files.find(({ file_name }) => file_name === paths[1]);
    if (!file) {
      global.replyMsg(ctx, `文件 ${paths[1]} 不存在`, false, true);
      return true;
    }

    const {
      data: { url },
    } = await global.bot('get_group_file_url', {
      group_id: ctx.group_id,
      ..._.pick(file, ['file_id', 'busid']),
    });
    global.replyMsg(ctx, handleFileUrl(url, file), false, true);
  }

  return true;
};
