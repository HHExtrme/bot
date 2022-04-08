const { Client, Message, MessageEmbed } = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))
const embedPage = require('../../functions/paginationEmbed.js')
if (!config.LEVELS_SYSTEM.ENABLED) return
const xp = require('simply-xp')

module.exports = {
    name: "leaderboard",
    permission: "LEADERBOARD",
    aliases: ["lb"],
    category: ["levels"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        await xp.leaderboard(client, message.guild.id, 30).then(board => {
            let a = [];
            let b = [];
        
            if (config.LEVELS_SYSTEM.LEADEARBOARD == "xp") {
                board.forEach(user => {
                    if (user.position <= 15) {
                         a.push(`• ${user.tag} - XP: ${user.shortxp}`)
                     } else if (user.position > 15 && user.position <= 30) {
                         b.push(`• ${user.tag} - XP: ${user.shortxp}`)
                     };
                 });
            } else if (config.LEVELS_SYSTEM.LEADEARBOARD == "level") {
                board.forEach(user => {
                    if (user.position <= 15) {
                         a.push(`• ${user.tag} - Level: ${user.level}`)
                     } else if (user.position > 15 && user.position <= 30) {
                         b.push(`• ${user.tag} - Level: ${user.level}`)
                     };
                 });
            }

            let embed1 = new MessageEmbed()
                .setTitle('Leaderboard')
                .setDescription(`***1 - 15 Users*** **leaderboard**\n\`\`\`\n${a.toString().replaceAll(',', '\n')}\n\`\`\``)
                .setColor('#075FFF');

            let embed2 = new MessageEmbed()
                .setTitle('Leaderboard')
                .setDescription(`***16 - 30 Users*** **leaderboard**\n\`\`\`\n${b.toString().replaceAll(',', '\n')}\n\`\`\``)
                .setColor('#6a48d1');

            const embeds = [embed1, embed2];
            embedPage(message, embeds, "30s", false)
        });
    },
};