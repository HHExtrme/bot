const { 
  Client, 
  Message, 
  MessageEmbed 
} = require('discord.js');

module.exports = {
  name: 'unwarn',
  permission: 'UNWARN',
  aliases: ["user-warn", "unwn"],
  description: 'unwarn kids',
  run: async (client, message, args) => {
    const WarnSchema = client.database.warnDatabase;

    const mentionedUser = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    if (!mentionedUser) {
      const warnError2 = new MessageEmbed() // Very few arguments have been given.
        .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL()})
        .setDescription("Very few arguments have been given.\n\nUsage: `unwarn <@user/id> <id_warn> [reason]`")
        .setColor('RED');
      return message.channel.send({ embeds: [warnError2] });
    }

    const reason = args.slice(2).join(" ") || "Not Specified";

    const WarnDoc = await WarnSchema
      .findOne({
        guildID: message.guild.id,
        memberID: mentionedUser.user.id,
      })
      .catch((err) => console.log(err));

    if (!WarnDoc || !WarnDoc.warnings.length) {
      const warnError3 = new MessageEmbed() // if the user has no warnings, send an error message
        .setTitle('Error')
        .setDescription(`${message.author} this user has no warnings!`)
        .setColor('RED')
      return message.channel.send({ embeds: [warnError3] })
    }

    const warnID = parseInt(args[1]);
    if (!warnID) {
      const noWarnId = new MessageEmbed() // if the user no put a warn id, send an error message
        .setTitle('Error')
        .setDescription(`${message.author} you need put a warn id!`)
        .setColor('RED')
      return message.channel.send({ embeds: [noWarnId] })
    }

    if (warnID <= 0 || warnID > WarnDoc.warnings.lenght) {
      const warnError4 = new MessageEmbed() // if the warn id is not valid, send an error message
        .setTitle('Error')
        .setDescription(`${message.author} this warn id is not valid!`)
        .setColor('RED')
      return message.channel.send({ embeds: [warnError4] })
    }

    WarnDoc.warnings.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);
    WarnDoc.moderator.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);
    WarnDoc.date.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);

    await WarnDoc.save().catch((err) => console.log(err));

    const Success = new MessageEmbed() // the user has been successfully unwarned
      .setTitle('Success')
      .setDescription(`${message.author} has been successfully unwarned!\nReason: ${reason}`)
      .setColor('GREEN')
    message.channel.send({ embeds: [Success] })
  }
}