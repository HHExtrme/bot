const { Client, Message, MessageEmbed } = require('discord.js');
const simplydjs = require("simply-djs");

module.exports = {
  name: "stealsticker",
  permission: "STEAL_STICKER",
  aliases: ["addsticker"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    simplydjs.stealSticker(message, args, {
        credit: false,
        embedColor: "AQUA",
    });
  },
};