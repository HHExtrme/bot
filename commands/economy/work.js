const { Client, Message, MessageEmbed } = require('discord.js');
const fs = require('fs');
const ms = require('ms');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "work",
    permission: "WORK",
    aliases: ["work"],
    category: ["economy"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const economy = client.database.economyDatabase;
        
        const cooldown = await manageCooldown(message, "work", "check", client);
        if (cooldown) return;

        const user = message.author;
        const guildData = await economy.findOne({ guildID: message.guild.id, userID: user.id });
        const randomMoney = Math.floor(Math.random() * config.ECONOMY_SYSTEM.WORK_COMMAND.MAX_MONEY) + client.config.ECONOMY_SYSTEM.WORK_COMMAND.MIN_MONEY;
        const works = config.ECONOMY_SYSTEM.WORKS;
        if (!guildData) {
            const newGuildData = new economy({
                guildID: message.guild.id,
                userID: user.id,
                balance: {
                    money: randomMoney,
                    bank: 0
                }
            });
            await newGuildData.save();
            const embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription("You worked as a " + works[Math.floor(Math.random() * works.length)] + " and earned " + `${config.ECONOMY_SYSTEM.COIN} ${randomMoney}` + "!")
                .setColor("GREEN")
                .setTimestamp();
                
            message.channel.send({embeds: [embed]});
            return await manageCooldown(message, "work", "set", client, client.config.ECONOMY_SYSTEM.WORK_COMMAND.COOLDOWN);
        } else {
            const embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription("You worked as a " + works[Math.floor(Math.random() * works.length)] + " and earned " + `${config.ECONOMY_SYSTEM.COIN} ${randomMoney}` + "!")
                .setColor("GREEN")
                .setTimestamp();
            await economy.findOneAndUpdate({ guildID: message.guild.id, userID: user.id }, { $inc: { "balance.money": randomMoney } });
            
            message.channel.send({embeds: [embed]});
            return await manageCooldown(message, "work", "set", client, client.config.ECONOMY_SYSTEM.WORK_COMMAND.COOLDOWN);
        }
    },
};

async function manageCooldown(message, command, option, client, time) {
    return new Promise((resolve, reject) => {
        if (option == "check") {
            if (client.cooldown.has(`${command}${message.author.id}`)) {
                message.channel.send({embeds: [
                    new MessageEmbed()
                        .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                        .setColor("RED")
                        .setDescription(`Sorry ${message.author}, you are still in cooldown!\nTime left: **${ms(client.cooldown.get(`${command}${message.author.id}`) - Date.now(), { long: true })}**.`)
                ]});
                return resolve(true);
            } else {
                return resolve(false);
            }
        } else if (option == "set") {
            client.cooldown.set(`${command}${message.author.id}`, Date.now() + ms(time))
            setTimeout(() => {
                client.cooldown.delete(`${command}${message.author.id}`);
            }, ms(time));
        }
    });
};