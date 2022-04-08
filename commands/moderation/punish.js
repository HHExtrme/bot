const { Client, Message, MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {
    name: "punish",
    permission: "PUNISH",
    aliases: ["punish"],
    category: ["moderation"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const BanSchema = client.database.banDatabase;
        const WarnSchema = client.database.warnDatabase;

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        const reason = args[1] || 'No reason specified.';

        if (!member) return message.reply("Please mention a valid member of this server");
        
        const row = (state) => [
            new MessageActionRow().addComponents(
                new MessageButton()
                    .setCustomId("kick")
                    .setLabel("kick")
                    .setEmoji("🦶")
                    .setDisabled(state)
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("ban")
                    .setLabel("ban")
                    .setEmoji("❌")
                    .setDisabled(state)
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("cancel")
                    .setLabel("cancel")
                    .setEmoji("⛔")
                    .setDisabled(state)
                    .setStyle("DANGER"),
                new MessageButton()
                    .setCustomId("mute")
                    .setLabel("mute")
                    .setEmoji("🔇")
                    .setDisabled(state)
                    .setStyle("PRIMARY"),
                new MessageButton()
                    .setCustomId("warn")
                    .setLabel("warn")
                    .setEmoji("⚠️")
                    .setDisabled(state)
                    .setStyle("PRIMARY")
            )
        ]

        const canPunish = await canUse(message.member, member)
        if (!canPunish) return message.reply("You cannot punish this user!");

        const msg = await message.reply({embeds: [
            new MessageEmbed()
                .setTitle("Punish " + member.user.tag)
                .setDescription(`Hey ${message.author.tag}, what do you want to do with ${member.user.tag}?\nReason: \`${reason}\``)
                .setColor("#2f3136")
        ], components: row(false)})

        const collector = msg.createMessageComponentCollector({filter: m => m.user.id === message.author.id, time: 30000});
        collector.on('collect', async (ints) => {
            await ints.deferUpdate();
            if (ints.customId === "kick") {
                await member.kick(`${reason + " | Kicked by " + message.author.tag}`);
                await msg.edit({embeds: [
                    new MessageEmbed()
                        .setTitle("Punish " + member.user.tag)
                        .setDescription(`Hey ${message.author.tag}, ${member.user.tag} has been kicked.`)
                        .setColor("GREEN")
                ], components: []})
            } else if (ints.customId === "ban") {
                await member.ban(`${reason + " | Banned by " + message.author.tag}`);
                
                const ban = await BanSchema.findOne({
                    guildID: message.guild.id,
                    memberID: member.id
                });

                if (ban) {
                    ban.bans.push(reason);
                    ban.moderator.push(message.member.id);
                    ban.date.push(Date.now());
                    await ban.save();
                } else {
                    await BanSchema.create({
                        guildID: message.guild.id,
                        memberID: member.id,
                        bans: [reason],
                        moderator: [message.member.id],
                        date: [Date.now()]
                    });
                }

                await msg.edit({embeds: [
                    new MessageEmbed()
                        .setTitle("Punish " + member.user.tag)
                        .setDescription(`Hey ${message.author.tag}, ${member.user.tag} has been banned.`)
                        .setColor("GREEN")
                ], components: []});
            } else if (ints.customId === "mute") {
                const muteRole = message.guild.roles.cache.find(r => r.name === "Muted");
                if (!muteRole) return msg.edit({embeds: [
                    new MessageEmbed()
                        .setTitle("Punish " + member.user.tag)
                        .setDescription(`Hey ${message.author.tag}, I couldn't find the mute role.`)
                        .setColor("RED")
                ], components: []});

                const isMuted = member.roles.cache.get(muteRole.id);
                if (isMuted) {
                    await member.roles.remove(muteRole);
                    await msg.edit({embeds: [
                        new MessageEmbed()
                            .setTitle("Punish " + member.user.tag)
                            .setDescription(`Hey ${message.author.tag}, ${member.user.tag} has been unmuted.`)
                            .setColor("GREEN")
                    ], components: []});
                } else {
                    await msg.edit({embeds: [
                        new MessageEmbed()
                            .setTitle("Punish " + member.user.tag)
                            .setDescription(`Hey ${message.author.tag}, ${member.user.tag} has been muted.`)
                            .setColor("GREEN")
                    ], components: []});
                }
            } else if (ints.customId === "warn") {
                const warn = await WarnSchema.findOne({
                    guildID: message.guild.id,
                    memberID: member.id
                });

                if (warn) {
                    warn.warnings.push(reason);
                    warn.moderator.push(message.member.id);
                    warn.date.push(Date.now());
                    await warn.save();
                } else {
                    await WarnSchema.create({
                        guildID: message.guild.id,
                        memberID: member.id,
                        warnings: [reason],
                        moderator: [message.member.id],
                        date: [Date.now()]
                    });
                }

                await msg.edit({embeds: [
                    new MessageEmbed()
                        .setTitle("Punish " + member.user.tag)
                        .setDescription(`Hey ${message.author.tag}, ${member.user.tag} has been warned.`)
                        .setColor("GREEN")
                ], components: []});
            } else if (ints.customId === "cancel") {
                await msg.edit({embeds: [
                    new MessageEmbed()
                        .setTitle("Punish " + member.user.tag)
                        .setDescription(`Hey ${message.author.tag}, punishment has been cancelled.`)
                        .setColor("RED")
                ], components: row(true)});
            }
        });
    },
};

function canUse(staff, member) {
    return new Promise(async (resolve, reject) => {
        if (member.roles.highest.position >= staff.roles.highest.position) {
            resolve(false);
        } else {
            resolve(true);
        }
    });
}