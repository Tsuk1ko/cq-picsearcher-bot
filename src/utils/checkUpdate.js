import { spawn } from 'child_process';
import { resolve } from 'path';
import _ from 'lodash';
import { get } from 'axios';
import removeMd from 'remove-markdown';
import compareVersions from 'compare-versions';
import { listServerRefs } from 'isomorphic-git';
import http from 'isomorphic-git/http/node';

const { version, repository } = require('../../package.json');

const repoUrl = repository.url.replace(/^git\+/, '');
const repoName = repoUrl.split(/\/|\./).slice(-3, -1).join('/');

let lastCheck = '0.0.0';

const getLatestVersion = async () => {
  const refs = await listServerRefs({
    http,
    url: repoUrl.replace('github.com', 'github.com.cnpmjs.org'),
    prefix: 'refs/tags/v2',
  });
  const versions = refs.map(({ ref }) => ref.replace('refs/tags/v', '')).sort(compareVersions);
  return _.last(versions);
};

export const checkUpdate = async () => {
  const latestVersion = await getLatestVersion();
  if (!latestVersion || lastCheck === latestVersion || compareVersions.compare(version, latestVersion, '>=')) return;
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
