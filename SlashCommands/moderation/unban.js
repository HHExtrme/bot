const { 
  Client, 
  CommandInteraction, 
  MessageEmbed 
} = require("discord.js");

module.exports = {
  name: "unban",
  permission: "UNBAN",
  description: "Unbans a user from the server.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "id",
      description: "The id of the user to unban.",
      type: "STRING",
      required: true
    },
    {
      name: "reason",
      description: "The reason for the unban.",
      type: "STRING",
      required: true
    }
  ],
  /**
   *
   * @param {Client} client
   * @param {CommandInteraction} interaction
   * @param {String[]} args
   */
  run: async (client, interaction, args) => {
    const date = new Date();
    // if the user no haver permission to use this command, return
    // set the user to be unbanned
    let user = interaction.options.getString('id');

    // set the reason
    let reason = interaction.options.getString('reason');
    // unban the user
    interaction.guild.members
    .unban(user, `${interaction.user.tag} - ${reason}`)
    .then((user) => {
            // set the embed
            let embed = new MessageEmbed()
                .setTitle("User UnBanned ✅")
                .setColor("#ff0000")
                .setDescription(`**User:** ${user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user}\n**Date:** ${date.toLocaleDateString()}`)
                .setTimestamp()
            // send the embed
            return interaction.reply({embeds: [embed]});
    })
    .catch((err) => {
        return interaction.reply(`${interaction.user} the user is not banned!\n${err}`.replace('DiscordAPIError: ', ''));
    })
  },
};