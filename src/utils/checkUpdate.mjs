import { spawn } from 'child_process';
import { resolve } from 'path';
import AxiosRaw from 'axios';
import { compare } from 'compare-versions';
import Fs from 'fs-extra';
import _ from 'lodash-es';
import removeMd from 'remove-markdown';
import Axios from './axiosProxy.mjs';
import { IS_DOCKER } from './env.mjs';
import { getDirname } from './path.mjs';

const __dirname = getDirname(import.meta.url);

const { version, repository } = Fs.readJsonSync(resolve(__dirname, '../../package.json'));

const repoUrl = repository.url.replace(/^git\+/, '');
const repoName = repoUrl.split(/\/|\./).slice(-3, -1).join('/');

let lastCheck = '0.0.0';

const getLatestVersion = async () => {
  const { data } = await Axios.get(`https://api.github.com/repos/${repoName}/tags?per_page=1`);
  return _.get(data, '[0].name', '').replace(/^v/, '');
};

export const checkUpdate = async () => {
  const latestVersion = await getLatestVersion();
  if (!latestVersion || lastCheck === latestVersion || compare(version, latestVersion, '>=')) return;
  console.log(`发现新版本：${latestVersion}`);
  const { data: fullChangelog } = await AxiosRaw.get(
    `https://mirror.ghproxy.com/https://raw.githubusercontent.com/${repoName}/v${latestVersion}/CHANGELOG.md`
  );
  const changelogs = _.transform(
    fullChangelog.split(/\s*###\s*/),
    (arr, text) => {
      text = text.replace(/\n+## .+$/, '');
      const v = _.get(/^\d+-\d+[ \t]+[vV]([\d.]+)/.exec(text), 1);
      if (!v) return;
      if (compare(version, v, '<')) {
        arr.push('', removeMd(text.trim(), { stripListLeaders: false }));
      }
      if (arr.length >= 7) return false;
    },
    [`发现新版本 v${latestVersion}`]
  );
  if (!IS_DOCKER) {
    changelogs.push('', '实验性更新指令：--update-cqps', '建议在可以登上服务器的状态下使用，以免出现意外起不来（');
  }
  global.sendMsg2Admin(changelogs.join('\n'));
  lastCheck = latestVersion;
};

export const execUpdate = () => {
  const args = process.platform === 'win32' ? ['start cmd /c npm run update'] : ['npm', ['run', 'update']];
  spawn(...args, {
    env: { ...process.env, RUN_BY_CQPS: 'true' },
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
    cwd: resolve(__dirname, '../..'),
    shell: process.platform === 'win32',
  }).unref();
};
