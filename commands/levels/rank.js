const { Client, Message } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))
if (!config.LEVELS_SYSTEM.ENABLED) return
const xp = require('simply-xp')

module.exports = {
  name: "rank",
  permission: "RANK",
  aliases: ["rank-card"],
  category: ["levels"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    let member = message.mentions.users.first() || message.author
  
    xp.rank(message, member.id, message.guild.id).then((img) => {
      message.channel.send({ files: [img], content: "> **Viewing rank card • [** "+member.tag+" **] •**" })
    })
  },
};