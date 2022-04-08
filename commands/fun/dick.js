const { 
    Client,
    Message,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "dick",
    permission: "DICK",
    description: "Get size of your dick",
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
                .setDescription(`${user}'s dick size is ${Math.floor(Math.random() * 30)}cm`)
                .setColor("#2f3136")]});
    },
};