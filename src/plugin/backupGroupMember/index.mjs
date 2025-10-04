import dayjs from 'dayjs';
import emitter from '../../utils/emitter.mjs';
import { sleep } from '../../utils/sleep.mjs';
import { clearOldData, ensureDataDir, writeData } from './storage.mjs';

const DAY_MS = 1000 * 60 * 60 * 24;

let intervalTimer = null;

const init = () => {
  const enable = global.config.backupGroupMember.enable;

  if (enable & !intervalTimer) {
    intervalTimer = setInterval(startBackup, DAY_MS);
  } else if (!enable && intervalTimer) {
    clearInterval(intervalTimer);
    intervalTimer = null;
  }
};

emitter.onConfigReload(init);
emitter.onConfigReady(init);

const startBackup = async () => {
  await global.botReady();

  const format = getWriteFormat();
  const date = dayjs().format('YYYYMMDD');

  await clearOldData().catch(console.error);
  ensureDataDir(date);

  const groupList = await getGroupList().catch(e => {
    console.error(e);
    return [];
  });
  if (!groupList.length) return;
  await writeData(date, '_', groupList, format);

  let count = 0;

  for (const group of groupList) {
    await sleep(1000);
    const memberList = await getGroupMemberList(group.group_id);
    if (!memberList.length) continue;
    await writeData(date, group.group_id, memberList, format);
    count++;
  }

  console.log(`已完成 ${count} 个群的群成员备份`);
};

const getWriteFormat = () => {
  const { format } = global.config.backupGroupMember;
  return format === 'json' ? 'json' : 'csv';
};

const getGroupList = async () => {
  const { bot } = global;
  const { whitelist, blacklist } = global.config.backupGroupMember;

  const { data } = await bot('get_group_list', { no_cache: true });

  if (whitelist.length) {
    const set = new Set(whitelist.map(v => Number(v)));
    return data.filter(g => set.has(g.group_id));
  } else if (blacklist.length) {
    const set = new Set(blacklist.map(v => Number(v)));
    return data.filter(g => !set.has(g.group_id));
  }

  return data;
};

const getGroupMemberList = async gid => {
  try {
    const { bot } = global;

    const { data } = await bot('get_group_member_list', { group_id: gid, no_cache: true });

    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
};
