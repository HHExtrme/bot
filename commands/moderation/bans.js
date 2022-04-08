const { 
  Client, 
  Message, 
  MessageEmbed 
} = require('discord.js');

module.exports = {
    name: "bans",
    permission: "BANS",
    aliases: ["baneos", "user-bans", "bans-user", "bns"],
    category: ["moderation"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const BanSchema = client.database.banDatabase;
    
        const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);

        if (!user) {
            const noUser = new MessageEmbed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription("Very few arguments have been given.\n\nUsage: `bans <@user/id>`")
                .setColor('RED');
            return message.channel.send({embeds: [noUser]});
        };

    
        const banDoc = await BanSchema.findOne({ guildID: message.guild.id, memberID: user.user.id });
        if (!banDoc || !banDoc.bans.length) return message.channel.send({content: `${user} has no bans`});

        const data = [];
        for (let i = 0; banDoc.bans.length > i; i++) {
            data.push(`**ID:** ${i + 1}`);
            data.push(`**Reason:** ${banDoc.bans[i]}`);
            data.push(`**Moderator:** ${await message.client.users.fetch(banDoc.moderator[i]).catch(() => "Deleted User")}`);
            data.push(`**Date:** ${new Date(banDoc.date[i]).toLocaleDateString()}\n`);
        };

        const embed = new MessageEmbed()
            .setColor("#ff0000")
            .setTitle(`${user.user.tag}'s bans`)
            .setThumbnail(user.displayAvatarURL({ dynamic: false }))
            .setDescription(data.join("\n"));
        message.channel.send({embeds: [embed]});
    },
};