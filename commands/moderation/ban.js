const { 
    Client, 
    Message, 
    MessageEmbed 
} = require('discord.js');

module.exports = {
    name: "ban",
    permission: "BAN",
    aliases: ["user-ban", "ban-user", "bn"],
    category: ["general"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const BanSchema = client.database.banDatabase;

        const date = new Date();
        if (!message.guild.me.permissions.has("BAN_MEMBERS")) {
          return message.channel.send(`${message.author} I do not have the permission to ban members.`).then(msg => { setTimeout(() => { msg.delete(); message.delete(); },5000);});
        }

        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!user) {
            const noUser = new MessageEmbed()
                .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
                .setDescription("Very few arguments have been given.\n\nUsage: `ban <@user/id> [reason]`")
                .setColor('RED')
            return message.channel.send({embeds: [noUser]});
        }

        if (user.id === message.author.id) {
          return message.channel.send(`${message.author} You cannot ban yourself.`).then(msg => { setTimeout(() => { msg.delete(); message.delete(); },5000);});
        }

        if (user.roles.highest.position >= message.member.roles.highest.position) {
            return message.channel.send(`${message.author} You cannot ban this user.`).then(msg => { setTimeout(() => { msg.delete(); message.delete(); },5000);});
        }

        if (user.id === message.guild.ownerID) {
          return message.channel.send(`${message.author} You cannot ban the server owner.`).then(msg => { setTimeout(() => { msg.delete(); message.delete(); },5000);});
        }

        if (user.id === client.user.id) {
          return message.channel.send(`${message.author} You cannot ban me.`).then(msg => { setTimeout(() => { msg.delete(); message.delete(); },5000);});
        }

        const reason = args.slice(1).join(" ") || "No reason given.";

        if (!reason) {
          return message.channel.send(`${message.author} Please specify a reason for the ban.`).then(msg => { setTimeout(() => { msg.delete(); message.delete(); },5000);});
        }

        if (!user.bannable) {
          return message.channel.send(`${message.author} I cannot ban this user.`).then(msg => { setTimeout(() => { msg.delete(); message.delete(); },5000);});
        }

        await user.ban({
            reason: `${message.author.tag} - ${reason}`
        })

        let banDoc = await BanSchema.findOne({ guildID: message.guild.id, memberID: user.user.id });

        if (!banDoc) {
            banDoc = new BanSchema ({
                guildID: message.guild.id,
                memberID: user.user.id,
                bans: [reason],
                moderator: [message.member.id],
                date: [Date.now()],
            });
            await banDoc.save();

            const embed = new MessageEmbed()
                .setTitle("User Banned ✅")
                .setColor("#ff0000")
                .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author}\n**Date:** ${date.toLocaleDateString()}`)
                .setTimestamp()

            message.channel.send({embeds: [embed]})
        } else {
            banDoc.bans.push(reason);
            banDoc.moderator.push(message.member.id);
            banDoc.date.push(Date.now());
            await banDoc.save().catch((err) => console.log(err))

            const embed = new MessageEmbed()
                .setTitle("User Banned ✅")
                .setColor("#ff0000")
                .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${message.author}\n**Date:** ${date.toLocaleDateString()}`)
                .setTimestamp()
            message.channel.send({embeds: [embed]})
        }
    },
};