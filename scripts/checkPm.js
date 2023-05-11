const ua = process.env.npm_config_user_agent;
if (!ua) process.exit(1);

const pm = ua.split(' ')[0].split('/')[0];
if (pm !== 'yarn') {
  console.error('请使用 npm run install:main 或 yarn 安装依赖\n');
  process.exit(1);
}
