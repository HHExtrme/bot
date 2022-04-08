const { Client, Message } = require('discord.js');
const simplydjs = require('simply-djs');

module.exports = {
  name: "ttt",
  permission: "TIC_TAC_TOE",
  aliases: ["tictactoe"],
  category: ["Fun"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    simplydjs.tictactoe(message, {
      embedColor: "AQUA",
      credit: false,
      resultBtn: true,      
    });
  },
};