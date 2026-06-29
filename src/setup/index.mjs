import './console.mjs';
import './env.mjs';
import './check.mjs';
import './config.mjs';
import '../plugin/backupGroupMember/index.mjs';

process.on('SIGHUP', () => process.exit(128 + 1));
process.on('SIGINT', () => process.exit(128 + 2));
process.on('SIGTERM', () => process.exit(128 + 15));
