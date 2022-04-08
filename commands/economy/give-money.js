const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "give-money",
    permission: "GIVE_MONEY",
    aliases: ["give-money"],
    category: ["economy"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const economy = client.database.economyDatabase;

        const user = message.mentions.users.first();
        if (!user) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please mention a user to give money to.\nUsage: `" + config.PREFIX + "give-money <user> <amount>`")
                .setColor("RED")
                .setTimestamp()
        ]});

        const amount = args[1];
        if (!amount) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify an amount to give.")
                .setColor("RED")
                .setTimestamp()
        ]});

        if (isNaN(amount)) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify a valid amount to give.")
                .setColor("RED")
                .setTimestamp()
        ]});

        const guildData = await economy.findOne({ guildID: message.guild.id, userID: user.id });
        if (!guildData) {
            const newEconomy = new economy({
                guildID: message.guild.id,
                userID: user.id,
                balance: {
                    money: 0,
                    bank: parseInt(amount)
                }
            });
            await newEconomy.save();
            
            return message.channel.send({embeds: [
                new MessageEmbed()
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription("Gave " + config.ECONOMY_SYSTEM.COIN + " " + amount + " to " + user.tag + "!")
                    .setColor("GREEN")
                    .setTimestamp()
            ]});
        } else {
            guildData.balance.bank = guildData.balance.bank + parseInt(amount);
            await guildData.save();

            return message.channel.send({embeds: [
                new MessageEmbed()
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription("Gave " + config.ECONOMY_SYSTEM.COIN + " " + amount + " to " + user.tag + "!")
                    .setColor("GREEN")
                    .setTimestamp()
            ]});
        }
    },
};