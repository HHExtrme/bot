const { 
    Client,
    Message,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "iq",
    permission: "IQ",
    description: "Get IQ of a user",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.members.first() || message.member;
        message.channel.send({embeds: [
            new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`${user}'s IQ is ${Math.floor(Math.random() * 100)}`)]});
    },
};