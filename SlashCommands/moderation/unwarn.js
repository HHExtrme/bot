const { 
  Client, 
  CommandInteraction, 
  MessageEmbed 
} = require("discord.js");

module.exports = {
  name: "unwarn",
  permission: "UNWARN",
  description: "Unwarns a user from the server.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "member",
      description: "The member to unwarn.",
      type: "USER",
      required: true
    },
    {
      name: "id-warn",
      description: "The id of the warn to remove.",
      type: "NUMBER",
      required: true
    },
    {
      name: "reason",
      description: "The reason for the unwarn.",
      type: "STRING",
      required: false
    }
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const mentionedUser = interaction.options.getMember('member');
    const reason = interaction.options.getString('reason') || "No reason given.";

    const WarnSchema = client.database.warnDatabase;

    const WarnDoc = await WarnSchema
      .findOne({
        guildID: interaction.guild.id,
        memberID: mentionedUser.user.id,
      })
      .catch((err) => console.log(err));

    if (!WarnDoc || !WarnDoc.warnings.length) {
      const warnError3 = new MessageEmbed() // if the user has no warnings, send an error message
        .setTitle('Error')
        .setDescription(`${interaction.user} this user has no warnings!`)
        .setColor('RED')
      return interaction.reply({ embeds: [warnError3] })
    }

    const warnID = interaction.options.getNumber('id-warn');
    if (!warnID) {
      const noWarnId = new MessageEmbed() // if the user no put a warn id, send an error message
        .setTitle('Error')
        .setDescription(`${interaction.user} you need put a warn id!`)
        .setColor('RED')
      return interaction.reply({ embeds: [noWarnId] })
    }

    if (warnID <= 0 || warnID > WarnDoc.warnings.lenght) {
      const warnError4 = new MessageEmbed() // if the warn id is not valid, send an error message
        .setTitle('Error')
        .setDescription(`${interaction.user} this warn id is not valid!`)
        .setColor('RED')
      return interaction.reply({ embeds: [warnError4] })
    }

    WarnDoc.warnings.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);
    WarnDoc.moderator.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);
    WarnDoc.date.splice(warnID - 1, warnID !== 1 ? warnID - 1 : 1);

    await WarnDoc.save().catch((err) => console.log(err));

    const Success = new MessageEmbed() // the user has been successfully unwarned
      .setTitle('Success')
      .setDescription(`${interaction.user} has been successfully unwarned!\nReason: ${reason}`)
      .setColor('GREEN')
    interaction.reply({ embeds: [Success] })
  }
}