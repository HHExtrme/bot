const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "remove-money",
    permission: "REMOVE_MONEY",
    aliases: ["remove-money"],
    category: ["economy"],
    usage: "<user> <cash/bank> <amount>",
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const economy = client.database.economyDatabase;

        const user = message.mentions.users.first();
        if (!user) {
            const embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please mention a user to remove money from.\nUsage: `" + config.PREFIX + "remove-money <user> <cash/bank> <amount>`")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }

        const types = ["cash", "bank"];
        const type = args[1];
        if (!type) {
            const embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify a type to remove money from.\nUsage: `" + config.PREFIX + "remove-money <user> <cash/bank> <amount>`")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }
        if (!types.includes(type)) {
            const embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify a valid type to remove money from.\nUsage: `" + config.PREFIX + "remove-money <user> <cash/bank> <amount>`")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }

        const amount = args[2];
        if (!amount) {
            const embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify an amount to remove.")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }
        if (isNaN(amount)) {
            const embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please specify a valid amount to remove.")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }

        const guildData = await economy.findOne({ guildID: message.guild.id, userID: user.id });
        if (!guildData) {
            const embed = new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("The user does not have any money!")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        } else {
            if (type === "cash") {
                if (guildData.balance.money < parseInt(amount)) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                        .setDescription("The user does not have enough money!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                }
                const embed = new MessageEmbed()
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription("Removed " + config.ECONOMY_SYSTEM.COIN + " " + amount + " from " + user.tag + "!")
                    .setColor("GREEN")
                    .setTimestamp();
                guildData.balance.money = guildData.balance.money - parseInt(amount);
                await guildData.save();
                return message.channel.send({embeds: [embed]});
            } else if (type === "bank") {
                if (guildData.balance.bank < parseInt(amount)) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                        .setDescription("The user does not have enough money!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                }
                const embed = new MessageEmbed()
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription("Removed " + config.ECONOMY_SYSTEM.COIN + " " + amount + " from the bank of " + user.tag + "!")
                    .setColor("GREEN")
                    .setTimestamp();
                guildData.balance.bank = guildData.balance.bank - parseInt(amount);
                await guildData.save();
                return message.channel.send({embeds: [embed]});
            } else {
                const embed = new MessageEmbed()
                    .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                    .setDescription("Please specify a valid type to remove money from.\nUsage: `" + config.PREFIX + "remove-money <user> <cash/bank> <amount>`")
                    .setColor("RED")
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            }
        }
    },
};