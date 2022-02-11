import { spawn } from 'child_process';
import { resolve } from 'path';
import _ from 'lodash';
import { get } from 'axios';
import removeMd from 'remove-markdown';
import compareVersions from 'compare-versions';
const Axios = require('../axiosProxy');

const { version, repository } = require('../../package.json');

const repoUrl = repository.url.replace(/^git\+/, '');
const repoName = repoUrl.split(/\/|\./).slice(-3, -1).join('/');

let lastCheck = '0.0.0';

const getLatestVersion = async () => {
  const { data } = await Axios.get(`https://api.github.com/repos/${repoName}/tags?per_page=1`);
  return _.get(data, '[0].name', '').replace(/^v/, '');
};

export const checkUpdate = async () => {
  const latestVersion = await getLatestVersion();
  if (!latestVersion || lastCheck === latestVersion || compareVersions.compare(version, latestVersion, '>=')) return;
  console.log(global.getTime(), `发现新版本：${latestVersion}`);
  const { data: fullChangelog } = await get(`https://cdn.jsdelivr.net/gh/${repoName}@v${latestVersion}/CHANGELOG.md`);
  const changelogs = _.transform(
    fullChangelog.split(/\s*###\s*/),
    (arr, text) => {
      text = text.replace(/\n+## .+$/, '');
      const v = _.get(/^\d+-\d+[ \t]+[vV]([\d.]+)/.exec(text), 1);
      if (!v) return;
      if (compareVersions.compare(version, v, '<')) {
        arr.push(removeMd(text.trim(), { stripListLeaders: false }));
      }
    },
    [`发现新版本 v${latestVersion}`, '']
  );
  changelogs.push('', '实验性更新指令：--update-cqps', '建议在可以登上服务器的状态下使用，以免出现意外起不来（');
  global.sendMsg2Admin(changelogs.join('\n'));
  lastCheck = latestVersion;
};

export const execUpdate = () => {
  spawn('npm', ['run', 'update'], {
    env: { ...process.env, NEED_UNREF: 'true' },
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    cwd: resolve(__dirname, '../..'),
  }).unref();
};
