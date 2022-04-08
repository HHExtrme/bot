const { Client, Message, MessageEmbed } = require('discord.js');
const simplydjs = require('simply-djs')

module.exports = {
  name: "stealemoji",
  permission: "STEAL_EMOJI",
  aliases: ["addemoji"],
  category: ["General"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (!args[0]) return message.reply({content: "You must provide an emoji name!"});
    
    simplydjs.stealEmoji(message, args, {
        credit: false,
        embedFoot: "Amazing emoji!",
    })
  },
};