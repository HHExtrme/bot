const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "pay",
    permission: "PAY",
    aliases: ["transfer"],
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
                .setDescription("Please mention a user to pay.\nUsage: `" + config.PREFIX + "pay <user> <amount>`")
                .setColor("RED")
                .setTimestamp()
        ]});

        if (user.id === message.author.id) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("You cannot pay yourself.")
                .setColor("RED")
                .setTimestamp()
        ]});
        if (user.bot) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("You cannot pay a bot.")
                .setColor("RED")
                .setTimestamp()
        ]});

        const amount = args[1];
        if (!amount) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify an amount to pay.")
                .setColor("RED")
                .setTimestamp()
        ]});

        if (isNaN(amount)) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify a valid amount to pay.")
                .setColor("RED")
                .setTimestamp()
        ]});

        const user1Data = await economy.findOne({ guildID: message.guild.id, userID: message.author.id });
        const user2Data = await economy.findOne({ guildID: message.guild.id, userID: user.id });

        if (!user1Data) {
            return message.channel.send({embeds: [
                new MessageEmbed()
                    .setAuthor({ name: message.author.tag, iconURL:  message.author.displayAvatarURL() })
                    .setDescription("Hey " + message.author.tag + ", you don't have any money to give!")
                    .setColor("RED")
                    .setTimestamp()
            ]});
        } else {
            if (amount > user1Data.balance.money) {
                return message.channel.send({embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL:  message.author.displayAvatarURL() })
                        .setDescription("Hey " + message.author.tag + ", you don't have enough money to give!")
                        .setColor("RED")
                        .setTimestamp()
                ]});
            }
            if (!user2Data) {
                const newData = new economy({
                    guildID: message.guild.id,
                    userID: user.id,
                    balance: {
                        money: 0,
                        bank: parseInt(amount)
                    }
                });
                newData.save();

                user1Data.balance.money -= parseInt(amount);
                user1Data.save();

                const embed = new MessageEmbed()
                    .setAuthor({ name:  message.author.tag, iconURL:  message.author.displayAvatarURL() })
                    .setDescription("You have successfully given " + config.ECONOMY_SYSTEM.COIN + amount + " to " + user.tag + "!")
                    .setColor("GREEN")
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            } else {
                user1Data.balance.money -= parseInt(amount);
                user1Data.save();

                user2Data.balance.money += parseInt(amount);
                user2Data.save();

                const embed = new MessageEmbed()
                    .setAuthor({ name:  message.author.tag, iconURL:  message.author.displayAvatarURL() })
                    .setDescription("You have successfully given " + config.ECONOMY_SYSTEM.COIN + amount + " to " + user.tag + "!")
                    .setColor("GREEN")
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            }
        }
    },
};