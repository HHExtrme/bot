const { 
  Client, 
  CommandInteraction, 
  MessageEmbed 
} = require("discord.js");

module.exports = {
  name: "warn-list",
  permission: "WARN_LIST",
  usage: "warns-list <user> <id>",
  description: "Show a list of warns for a user.",
  type: 'CHAT_INPUT',
  options: [
      {
          name: "user",
          description: "The user to check in the warn list.",
          type: "USER",
          required: false
      },
      {
          name: "id",
          description: "The id of the user to check in the warn list.",
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

    try {
      let user = interaction.options.getMember('user') || await client.users.fetch(interaction.options.getString('id'));
      const warnDoc = await WarnSchema
      .findOne({
        guildID: interaction.guild.id,
        memberID: user.user.id,
      })
      .catch((err) => console.log(err));

      if (!warnDoc || !warnDoc.warnings.length) {
        return interaction.reply({embeds: [new MessageEmbed().setDescription(`${user} has no warnings`).setColor("RED")]});
      }
    
      const data = [];
    
      for (let i = 0; warnDoc.warnings.length > i; i++) {
        data.push(`**ID:** ${i + 1}`);
        data.push(`**Reason:** ${warnDoc.warnings[i]}`);
        data.push(
          `**Moderator:** ${await interaction.client.users
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
    
      interaction.reply({embeds: [embed]});
    } catch (err) {
      interaction.reply("Could not find the user.");
    }
  },
};