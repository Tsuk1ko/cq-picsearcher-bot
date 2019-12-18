export default async function broadcast(bot, args) {
    const sendTo = gid =>
        bot('send_group_msg_rate_limited', {
            group_id: gid,
            message: args.broadcast,
        });
    if (args.only) {
        `${args.only}`.split(',').forEach(gid => sendTo(parseInt(gid)));
    } else {
        const groups = (await bot('get_group_list')).data.map(({ group_id }) => group_id);
        if (args.exclude) {
            const exclude = `${args.exclude}`.split(',').map(gid => parseInt(gid));
            groups.filter(gid => !exclude.includes(gid)).forEach(gid => sendTo(gid));
        } else if (args['only-admin']) {
            const selfqq = (await bot('get_login_info')).data.user_id;
            groups.forEach(gid => {
                bot('get_group_member_info_rate_limited', {
                    group_id: gid,
                    user_id: selfqq,
                    no_cache: true,
                }).then(({ data: { role } }) => {
                    if (role !== 'member') sendTo(gid);
                });
            });
        } else {
            groups.forEach(gid => sendTo(gid));
        }
    }
}
