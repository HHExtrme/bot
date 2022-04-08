const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "greroll",
    permission: "GREROLL",
    description: "reroll a giveaway",
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
        client.giveawaysManager.reroll(messageId, {
            winnerCount: client.config.GIVEAWAYS.REROLL_WINNERS,
            messages: {
                congrat: mensajes.GIVEAWAYS.NEW_WINNERS.replace("{prize}", "{this.prize}").replace("{url}", "{this.messageURL}")
            }
        }).then(() => {
            message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway rerolled!")]});
        }).catch((err) => {
            message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        });
    },
};