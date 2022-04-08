const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");

module.exports = {
    name: "ban-list",
    permission: "BAN_LIST",
    usage: "ban-list <user>",
    description: "Show the times the user was banned from the server.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "user",
            description: "The user to check in the ban list.",
            type: "USER",
            required: false
        },
        {
            name: "id",
            description: "The id of the user to check in the ban list.",
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
    // if the user no haver permission to use this command, return
    const BanSchema = client.database.banDatabase;

    // set the user to check for bans
    try {
      let user = interaction.options.getUser('user') || await client.users.fetch(interaction.options.getString('id'));
      const banDoc = await BanSchema
      .findOne({
        guildID: interaction.guild.id,
        memberID: user.id,
      })
      .catch((err) => console.log(err));

      if (!banDoc || !banDoc.bans.length) {
        return interaction.reply({content: `${user} has no bans`});
      }

      const data = [];

      for (let i = 0; banDoc.bans.length > i; i++) {
        data.push(`**ID:** ${i + 1}`);
        data.push(`**Reason:** ${banDoc.bans[i]}`);
        data.push(
          `**Moderator:** ${await interaction.client.users
            .fetch(banDoc.moderator[i])
            .catch(() => "Deleted User")}`
        );
        data.push(
          `**Date:** ${new Date(banDoc.date[i]).toLocaleDateString()}\n`
        );
      }

      // set a embed message
      const embed = new MessageEmbed()
          .setColor("#ff0000")
          .setTitle(`${user.tag}'s bans`)
          .setThumbnail(user.displayAvatarURL({ dynamic: false }))
          .setDescription(data.join("\n"));
      // send the embed message
      interaction.reply({embeds: [embed]});
    } catch (err) {
      interaction.reply("Couldn't find the user!");
    }
  },
};