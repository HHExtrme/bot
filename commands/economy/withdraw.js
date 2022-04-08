const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "withdraw",
    permission: "WITHDRAW",
    aliases: ["wd"],
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
                .setDescription("You don't have any money to withdraw!")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        } else {
            if (args[0].toLowerCase() == "all") {
                const embed = new MessageEmbed()
                    .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                    .setDescription("Withdrew " + config.ECONOMY_SYSTEM.COIN + " " + guildData.balance.bank + " from your bank!")
                    .setColor("GREEN")
                    .setTimestamp();
                guildData.balance.money = guildData.balance.money + guildData.balance.bank;
                guildData.balance.bank = 0;

                await guildData.save();
                return message.channel.send({embeds: [embed]});
            } else {
                const amount = parseInt(args[0]);
                if (!amount) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription("You didn't specify an amount to withdraw!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                } else if (amount < 1) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription("You can't withdraw a negative amount!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                } else if (amount > guildData.balance.bank) {
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription("You don't have that much money in your bank!")
                        .setColor("RED")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                } else {
                    guildData.balance.money = guildData.balance.money + amount;
                    guildData.balance.bank = guildData.balance.bank - amount;

                    await guildData.save();
                    const embed = new MessageEmbed()
                        .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                        .setDescription(`Withdrew ${config.ECONOMY_SYSTEM.COIN} ${amount} from your bank!`)
                        .setColor("GREEN")
                        .setTimestamp();
                    return message.channel.send({embeds: [embed]});
                }
            }
        }
    },
};