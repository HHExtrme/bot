const client = require('../../index');

client.giveawaysManager.on('giveawayReactionAdded', async (giveaway, member, reaction) => {
	const role = client.guilds.cache.get(giveaway.guildId).roles.cache.find(r => r.id === giveaway.extraData);
	if (!role) return;
    if (!member.roles.cache.get(giveaway.extraData)) {
		await reaction.users.remove(member.user);
        try {
			await member.send('You must have this role to participate in the giveaway: [`@' + role.name + '`] (' + role.id + ')');
		} catch (error) { };
	};
});