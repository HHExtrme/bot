const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");

module.exports = {
    name: "gend",
    permission: "GEND",
    aliases: ["gend"],
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
        client.giveawaysManager.end(messageId).then(() => {
            message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway ended!")]});
        }).catch((err) => {
            message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        });
    },
};