const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: "reset-money",
    permission: "RESET_MONEY",
    aliases: ["reset-money"],
    category: ["economy"],
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
                .setDescription("Please mention a user to reset money for.\nUsage: `" + client.config.PREFIX + "reset-money <user>`")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        }
        const guildData = await economy.findOne({ guildID: message.guild.id, userID: user.id });
        if (!guildData) {
            const embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription("This user has no money to reset.")
                .setColor("RED")
                .setTimestamp();
            return message.channel.send({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
                .setAuthor({ name: user.tag, iconURL: user.displayAvatarURL() })
                .setDescription("Reset all money for " + user.tag + "!")
                .setColor("GREEN")
                .setTimestamp();
            guildData.balance.money = 0;
            guildData.balance.bank = 0;
            await guildData.save();
            return message.channel.send({embeds: [embed]});
        }
    },
};