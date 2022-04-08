const { Client, Message, MessageEmbed } = require('discord.js');
const simplydjs = require("simply-djs");

module.exports = {
  name: "calc",
  permission: "CALC",
  aliases: ["calculadora", "calculator"],
  category: ["Fun"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {

    simplydjs.calculator(message, {
        embedColor: "#0099ff",
        credit: false,
        embedFooter: "Amazing calculator!",
      });
  },
};