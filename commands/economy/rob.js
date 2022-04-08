const { Client, Message, MessageEmbed } = require('discord.js');
const ms = require('ms');
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8'));

module.exports = {
    name: "rob",
    permission: "ROB",
    aliases: ["steal"],
    category: ["economy"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const economy = client.database.economyDatabase;
        
        const cooldown = await manageCooldown(message, "rob", "check", client);
        if (cooldown) return;

        const author = message.author;
        const userToRob = message.mentions.users.first() || message.guild.members.cache.get(args[0]);

        if (!userToRob) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("Please mention a user to rob.\nUsage: `" + config.PREFIX + "rob <user>`")
                .setColor("RED")
                .setTimestamp()
        ]});

        if (userToRob.id === author.id) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("You cannot rob yourself.")
                .setColor("RED")
                .setTimestamp()
        ]});

        if (userToRob.bot) return message.channel.send({embeds: [
            new MessageEmbed()
                .setAuthor({ name: message.author.tag, iconURL: message.author.displayAvatarURL() })
                .setDescription("You cannot rob bots.") 
                .setColor("RED")
                .setTimestamp()
        ]})

        const authorData = await economy.findOne({ guildID: message.guild.id, userID: author.id });
        const userToRobData = await economy.findOne({ guildID: message.guild.id, userID: userToRob.id });

        if (!userToRobData || userToRobData.balance.money < 1) {
            const embed = new MessageEmbed()
                .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
                .setDescription("You can't rob someone who doesn't have any money!")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        };

        if (!authorData) {
            const chance = Math.floor(Math.random() * 100);
            // Define the money that the author will get (using the bal of the userToRob)
            const money = Math.floor((userToRobData.balance.money + userToRobData.balance.bank) * (Math.random() * 0.5 + 0.5));
            if (chance < 50) {
                const embed = new MessageEmbed()
                    .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
                    .setDescription("You robbed " + userToRob.tag + " and got " + config.ECONOMY_SYSTEM.COIN + " " + money + "!")
                    .setColor("GREEN")
                    .setTimestamp();
                userToRobData.balance.money = userToRobData.balance.money - money;
                const newAuthorData = new economy({
                    guildID: message.guild.id,
                    userID: user.id,
                    balance: {
                        money: money,
                        bank: 0
                    }
                });
                await newAuthorData.save();
                await userToRobData.save();

                message.channel.send({embeds: [embed]});
                return await manageCooldown(message, "rob", "set", client, config.ECONOMY_SYSTEM.ROB_COOLDOWN);
            } else {
                const embed = new MessageEmbed()
                    .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
                    .setDescription("You tried to rob " + userToRob.tag + " but failed!\nYou lost " + config.ECONOMY_SYSTEM.COIN + " " + money + "!")
                    .setColor("RED")
                    .setTimestamp();
                authorData.balance.money = authorData.balance.money - money;
                await authorData.save();

                message.channel.send({embeds: [embed]});
            }
        } else {
            const chance = Math.floor(Math.random() * 100);
            const money = Math.floor((userToRobData.balance.money + userToRobData.balance.bank) * (Math.random() * 0.5 + 0.5));
            if (chance < 50) {
                const embed = new MessageEmbed()
                    .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
                    .setDescription("You robbed " + userToRob.tag + " and got " + config.ECONOMY_SYSTEM.COIN + " " + money + "!")
                    .setColor("GREEN")
                    .setTimestamp();
                authorData.balance.money = authorData.balance.money + money;
                userToRobData.balance.money = userToRobData.balance.money - money;
                await authorData.save();
                await userToRobData.save();

                return message.channel.send({embeds: [embed]});
            } else {
                const embed = new MessageEmbed()
                    .setAuthor({ name: author.tag, iconURL: author.displayAvatarURL() })
                    .setDescription("You tried to rob " + userToRob.tag + " but failed!\nYou lost " + config.ECONOMY_SYSTEM.COIN + " " + money + "!")
                    .setColor("RED")
                    .setTimestamp();
                authorData.balance.money = authorData.balance.money - money;
                await authorData.save();

                message.channel.send({embeds: [embed]});
                return await manageCooldown(message, "rob", "set", client, config.ECONOMY_SYSTEM.ROB_COOLDOWN);
            }
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