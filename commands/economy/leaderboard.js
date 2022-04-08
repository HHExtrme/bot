const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "leaderboard",
    permission: "LEADERBOARD_ECO",
    aliases: ["leaderboard"],
    category: ["economy"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const economy = client.database.economyDatabase;

        const guildData = await economy.find({ guildID: message.guild.id });
        if (!guildData) return message.channel.send("There are no users in this server.");
        const embed = new MessageEmbed()
            .setAuthor({ name: message.guild.name + "'s leaderboard", iconURL: message.guild.iconURL })
            .setColor("GREEN")
            .setTimestamp();
        let i = 1;
        let users = [];
        guildData.sort((a, b) => b.balance.bank - a.balance.bank).slice(0, 10).forEach(async (user) => {
            users.push({
                user: client.users.cache.get(user.userID)?.tag || (await client.users.fetch(user.userID))?.tag || "Deleted User#0000",
                balance: user.balance.bank + user.balance.money
            });
        });
        users.sort((a, b) => b.balance - a.balance);
        embed.setDescription(users.map(user => `**${i++}.** ${user.user} » ${config.ECONOMY_SYSTEM.COIN} ${user.balance}`).join("\n"));
        return message.channel.send({embeds: [embed]});
    },
};