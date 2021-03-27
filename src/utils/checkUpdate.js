import _ from 'lodash';
import { execSync } from 'child_process';
import { resolve } from 'path';
import { compare } from 'compare-versions';
import { get } from 'axios';
import removeMd from 'remove-markdown';

const { version } = require('../../package.json');
const cwd = resolve(__dirname, '../../');

let lastCheck = '0.0.0';

const getLatestTagRef = () =>
  _.last(_.compact(execSync('git ls-remote -qt --sort=v:refname', { cwd }).toString().split(/\s+/)));

export const checkUpdate = async () => {
  const latestVersion = getLatestTagRef().replace(/[^\d.]/g, '');
  if (lastCheck === latestVersion || compare(version, latestVersion, '>=')) return;
  const { data: fullChangelog } = await get(
    `https://cdn.jsdelivr.net/gh/Tsuk1ko/cq-picsearcher-bot@v${latestVersion}/CHANGELOG.md`
  );
  const changelogs = _.transform(
    fullChangelog.split(/\s*###\s*/),
    (arr, text) => {
      text = text.replace(/\n+## .+$/, '');
      const v = _.get(/^\d+-\d+[ \t]+[vV]([\d.]+)/.exec(text), 1);
      if (!v) return;
      if (compare(version, v, '<')) {
        arr.push(removeMd(text.trim(), { stripListLeaders: false }));
      }
    },
    [`发现新版本 v${latestVersion}`]
  );
  global.sendMsg2Admin(changelogs.join('\n\n'));
  lastCheck = latestVersion;
};
