const { 
  Client, 
  Message, 
  MessageEmbed 
} = require('discord.js');

module.exports = {
  name: "nuke",
  permission: "NUKE",
  aliases: ["nk"],
  category: ["moderation"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    const msgNuke = new MessageEmbed()
        .setColor("#2f3136")
        .setTitle("Channel Nuked")
        .setDescription("This channel has been nuked.")
        .setTimestamp();

    let posicion = message.channel.position;
    try {
        message.channel.clone().then((channel) => {
            message.channel.delete();
            channel.setPosition(posicion);
            channel.send({embeds: [msgNuke]});
          });
    } catch (err) {
        message.channel.send(err);
    }
  },
};