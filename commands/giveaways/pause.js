const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "gpause",
    permission: "GPAUSE",
    description: "pause a giveaway",
    aliases: ["gpause"],
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
        client.giveawaysManager.pause(messageId, {
            content: mensajes.GIVEAWAYS.GIVEAWAY_PAUSED,
            embedColor: mensajes.GIVEAWAYS.EMBED_COLOR_PAUSED,
        }).then(() => {
            message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway paused!")]});
        }).catch((err) => {
            message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        });
    },
};