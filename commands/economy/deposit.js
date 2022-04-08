const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "deposit",
    permission: "DEPOSIT",
    aliases: ["dep"],
    category: ["economy"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const economy = client.database.economyDatabase;

        const user = message.author;
        const guildData = await economy.findOne({ guildID: message.guild.id, userID: user.id });
        if (!guildData) {
            const embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription("You don't have any money to deposit!")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        } else {
            const arg0 = args[0];
            if (!arg0) {
                const embed = new MessageEmbed()
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription("You must specify an amount to deposit!")
                    .setColor("RED")
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            }
            if (arg0.toLowerCase() == "all") {
                const acutalMoney = guildData.balance.money;
                guildData.balance.bank = guildData.balance.bank + guildData.balance.money;
                guildData.balance.money = 0;

                await guildData.save();
                const embed = new MessageEmbed()
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription("Deposited " + acutalMoney + " to your bank!")
                    .setColor("GREEN")
                    .setTimestamp();
                return message.channel.send({embeds: [embed]});
            } else {
                const amount = parseInt(arg0);
                if (!amount) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription("You didn't specify an amount to deposit!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                } else if (amount < 1) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription("You can't deposit a negative amount!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                } else if (amount > guildData.balance.money) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription("You don't have that much money!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                } else {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription("Deposited " + config.ECONOMY_SYSTEM.COIN + " " + amount + " to your bank!")
                        .setColor("GREEN")
                        .setTimestamp();
                    guildData.balance.money -= amount;
                    guildData.balance.bank += amount;
                    guildData.save();
                    return message.channel.send({embeds: [embed]});
                }
            }
        }
    },
};