const { Client, Message, MessageEmbed } = require('discord.js');

module.exports = {
    name: "ping",
    permission: "PING",
    aliases: ["pong"],
    category: ["general"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const embed = new MessageEmbed()
            .setColor("#0099ff")
            .setTitle("Pong!")
            .setDescription(`${client.ws.ping}ms`);
        message.channel.send({embeds: [embed]});
    },
};