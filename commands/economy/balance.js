const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "balance",
    permission: "BALANCE",
    aliases: ["bal", "money", "bank"],
    category: ["economy"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const economy = client.database.economyDatabase;
        
        const user = message.mentions.users.first() || message.author;
        const guildData = await economy.findOne({ guildID: message.guild.id, userID: user.id });
        if (!guildData) {
            const embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .addField("Cash:", config.ECONOMY_SYSTEM.COIN + " 0", true)
                .addField("Bank:", config.ECONOMY_SYSTEM.COIN + " 0", true)
                .addField("Total:", config.ECONOMY_SYSTEM.COIN + " 0", true)
                .setColor("AQUA")
                .setTimestamp();
            message.channel.send({embeds: [embed]});
            try {
                const newGuildData = new economy({
                    guildID: message.guild.id,
                    userID: user.id,
                    cash: 0,
                    bank: 0
                });
                await newGuildData.save();
            } catch(err) {
                console.error(err);
            }
        } else {
            const embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .addField("Cash:", config.ECONOMY_SYSTEM.COIN + " " + guildData.balance.money, true)
                .addField("Bank:", config.ECONOMY_SYSTEM.COIN + " " + guildData.balance.bank, true)
                .addField("Total:", config.ECONOMY_SYSTEM.COIN + " " + (guildData.balance.money + guildData.balance.bank), true)
                .setColor("AQUA")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }
    },
};