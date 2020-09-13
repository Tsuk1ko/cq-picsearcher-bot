const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

class AsyncQueue extends Array {
  constructor(wait = 500) {
    super();
    this.running = false;
    this.wait = wait;
  }

  push(...items) {
    super.push(...items);
    if (this.running === false) {
      this.running = true;
      setTimeout(async () => {
        while (this.length) {
          await this.shift()();
          await sleep(this.wait);
        }
        this.running = false;
      });
    }
  }
}

const queue = new AsyncQueue();

export default async function broadcast(args) {
  const { bot } = global;

  const sendTo = gid => {
    if (global.config.bot.debug) {
      console.log(`${global.getTime()} 发送群组消息 group=${gid}`);
      console.log(args.broadcast);
    }
    bot('send_group_msg', {
      group_id: gid,
      message: args.broadcast,
    });
  };
  const queueSendTo = gid => queue.push(() => sendTo(gid));

  if (args.only) {
    `${args.only}`.split(',').forEach(gid => queueSendTo(parseInt(gid)));
  } else {
    const groups = (await bot('get_group_list')).data.map(({ group_id }) => group_id);
    if (args.exclude) {
      const exclude = `${args.exclude}`.split(',').map(gid => parseInt(gid));
      groups.filter(gid => !exclude.includes(gid)).forEach(gid => queueSendTo(gid));
    } else if (args['only-admin']) {
      const selfqq = (await bot('get_login_info')).data.user_id;
      groups.forEach(gid =>
        queue.push(() =>
          bot('get_group_member_info', {
            group_id: gid,
            user_id: selfqq,
            no_cache: true,
          }).then(({ data: { role } }) => {
            if (role !== 'member') return sendTo(gid);
          })
        )
      );
    } else {
      groups.forEach(gid => queueSendTo(gid));
    }
  }
}
