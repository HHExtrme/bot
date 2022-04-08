const { 
  Client, 
  CommandInteraction, 
  MessageEmbed 
} = require("discord.js");

module.exports = {
  name: "warn",
  permission: "WARN",
  description: "Warn a user from the server.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "member",
      description: "The member to warn.",
      type: "USER",
      required: true
    },
    {
      name: "reason",
      description: "The reason for the warn.",
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
      const WarnSchema = client.database.warnDatabase;

      const user = interaction.options.getMember('member');
      if (!user) {
        const warnError2 = new MessageEmbed()
          .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL()})
          .setDescription("Very few arguments have been given.\n\nUsage: `warn <@user/id> [reason]`")
          .setColor('RED')
        return interaction.reply({embeds: [warnError2]});
      }

      const MentionedPosition = user.roles.highest.MentionedPosition
      const memberPosition = interaction.member.roles.highest.position

      if (memberPosition <= MentionedPosition) {
          const warnError3 = new MessageEmbed()
          .setTitle('Error')
          .setDescription('You can not warn this person as their role position is higher/equal to yours')
          .setColor('RED')

          interaction.reply({embeds: [warnError3]})
      }

      const reason = interaction.options.getString('reason') || "Not Specified";

      let warnDoc = await WarnSchema
      .findOne({
          guildID: interaction.guild.id,
          memberID: user.user.id
      })
      .catch((err) => console.log(err));

      // la hora actual 
      const date = new Date();

      if (!warnDoc) {
          warnDoc = new WarnSchema ({
              guildID: interaction.guild.id,
              memberID: user.user.id,
              warnings: [reason],
              moderator: [interaction.member.id],
              date: [Date.now()],
          });

          await warnDoc.save().catch((err) => console.log(err));
          interaction.reply({embeds: [new MessageEmbed()
            .setTitle("User Warned ✅")
            .setColor("#ff0000")
            .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user}\n**Date:** ${date.toLocaleDateString()}`)
            .setTimestamp()
          ]})

    } else {   
    warnDoc.warnings.push(reason);
    warnDoc.moderator.push(interaction.member.id);
    warnDoc.date.push(Date.now());

    await warnDoc.save().catch((err) => console.log(err))

    const Success = new MessageEmbed()
    .setTitle("User Warned ✅")
    .setColor("#ff0000")
    .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user}\n**Date:** ${date.toLocaleDateString()}`)
    .setTimestamp()

    return interaction.reply({embeds: [Success]})
}
}
}