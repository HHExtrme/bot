const { MessageEmbed } = require('discord.js');

module.exports = {
  name: "warnings",
  permission: "WARNS",
  description: "Check warnings",
  aliases: ["warnlist", "listwarnings", "warns", "wns"],
  run: async (client, message, args) => {
    // if the user no haver permission to use this command, return
    const WarnSchema = client.database.warnDatabase;

    const user = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!user) return message.channel.send({embeds: [new MessageEmbed()
      .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
      .setDescription("Very few arguments have been given.\n\nUsage: `warns <@user/id>`")
      .setColor('RED')]});

    const warnDoc = await WarnSchema
      .findOne({
        guildID: message.guild.id,
        memberID: user.user.id,
      })
      .catch((err) => console.log(err));

    if (!warnDoc || !warnDoc.warnings.length) {
      return message.channel.send({embeds: [new MessageEmbed().setDescription(`${user} has no warnings`).setColor("RED")]});
    }

    const data = [];

    for (let i = 0; warnDoc.warnings.length > i; i++) {
      data.push(`**ID:** ${i + 1}`);
      data.push(`**Reason:** ${warnDoc.warnings[i]}`);
      data.push(
        `**Moderator:** ${await message.client.users
          .fetch(warnDoc.moderator[i])
          .catch(() => "Deleted User")}`
      );
      data.push(
        `**Date:** ${new Date(warnDoc.date[i]).toLocaleDateString()}\n`
      );
    }

    const embed = new MessageEmbed()
        .setColor("#ff0000")
        .setTitle(`${user.user.tag}'s warns`)
        .setThumbnail(user.displayAvatarURL({ dynamic: false }))
        .setDescription(data.join("\n"));

    message.channel.send({embeds: [embed]});
  },
};