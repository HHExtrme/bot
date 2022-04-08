const { 
  Client, 
  CommandInteraction, 
  MessageEmbed 
} = require("discord.js");

module.exports = {
  name: "ban",
  permission: "BAN",
  description: "Bans a user from the server.",
  type: 'CHAT_INPUT',
  options: [
    {
      name: "member",
      description: "The member to ban.",
      type: "USER",
      required: true
    },
    {
      name: "reason",
      description: "The reason for the ban.",
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
    const date = new Date();
    // if the user no haver permission to use this command, return
    const BanSchema = client.database.banDatabase;

    // if the bot no longer has the permission to ban members, return
    if (!interaction.guild.me.permissions.has("BAN_MEMBERS")) {
      return interaction.reply(`${interaction.user} I do not have the permission to ban members.`)
    }
    // set the user to ban
    let user = interaction.options.getMember('member');
    // if no put the user to ban, the bot return

    // if the user is the author of the message, return
    if (user.id === interaction.user.id) {
      return interaction.reply(`${interaction.user} You cannot ban yourself.`)
    }
    // if the user have a role higher than the message author, return
    if (user.roles.highest.position >= interaction.member.roles.highest.position) {
        return interaction.reply(`${interaction.user} You cannot ban this user.`)
    }
    // if the user is the owner of the guild, return
    if (user.id === interaction.guild.ownerID) {
      return interaction.reply(`${interaction.user} You cannot ban the server owner.`)
    }
    // if the user is the bot, return
    if (user.id === client.user.id) {
      return interaction.reply(`${interaction.user} You cannot ban me.`)
    }
    // set the reason
    let reason = interaction.options.getString('reason') || "No reason given.";
    // if the reason is not specified, return
    if (!reason) {
      return interaction.reply(`${interaction.user} Please specify a reason for the ban.`)
    }
    // if the bot no have the permission to ban to the user, return
    if (!user.bannable) {
      return interaction.reply(`${interaction.user} I cannot ban this user.`)
    }

    // ban to user with the reason
    await user.ban({
        reason: `${interaction.user.tag} - ${reason}`
    })

    let banDoc = await BanSchema
    .findOne({
        guildID: interaction.guild.id,
        memberID: user.user.id
    })
    .catch((err) => console.log(err));

    if (!banDoc) {
        banDoc = new BanSchema ({
            guildID: interaction.guild.id,
            memberID: user.user.id,
            bans: [reason],
            moderator: [interaction.member.id],
            date: [Date.now()],
        });
        // send data to database
        await banDoc.save().catch((err) => console.log(err));
        // set the embed
        let embed = new MessageEmbed()
          .setTitle("User Banned ✅")
          .setColor("#ff0000")
          .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user}\n**Date:** ${date.toLocaleDateString()}`)
          .setTimestamp()
        // send the embed
        interaction.reply({embeds: [embed]})
    } else {
        // send data to the database
    banDoc.bans.push(reason);
    banDoc.moderator.push(interaction.member.id);
    banDoc.date.push(Date.now());
    await banDoc.save().catch((err) => console.log(err))

    // set the embed
    let embed = new MessageEmbed()
    .setTitle("User Banned ✅")
    .setColor("#ff0000")
    .setDescription(`**User:** ${user.user.tag}\n**Reason:** ${reason}\n**Moderator:** ${interaction.user}\n**Date:** ${date.toLocaleDateString()}`)
    .setTimestamp()
    // send the embed
    interaction.reply({embeds: [embed]})
    // send the embed to a channel in specified
    }
  },
};