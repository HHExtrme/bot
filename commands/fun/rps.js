const { Client, Message, MessageEmbed } = require('discord.js');
const simplydjs = require("simply-djs");

module.exports = {
  name: "rps",
  permission: "RPS",
  aliases: ["rockpaperscissors"],
  category: ["Fun"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    simplydjs.rps(message, {
        credit: false,
    });
  },
};