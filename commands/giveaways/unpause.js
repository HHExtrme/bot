const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");

module.exports = {
    name: "gunpause",
    permission: "GUNPAUSE",
    description: "unpause a giveaway",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const messageId = args[0];
        if (!messageId) {
            return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("You need to specify a message id!")]});
        }

        client.giveawaysManager.unpause(messageId).then(() => {
            message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway unpaused!")]});
        }).catch((error) => {
            message.reply(`An error has occurred, please check and try again.\n\`${error}\``);
        })
    },
};