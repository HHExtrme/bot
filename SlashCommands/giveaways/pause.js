const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "gpause",
    permission: "GPAUSE",
    description: "pause a giveaway",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "message-id",
            description: "id of the giveaway",
            type: "STRING",
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const messageId = interaction.options.getString("message-id");
        client.giveawaysManager.pause(messageId, {
            content: mensajes.GIVEAWAYS.GIVEAWAY_PAUSED,
            embedColor: mensajes.GIVEAWAYS.EMBED_COLOR_PAUSED,
        }).then(() => {
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway paused!")]});
        }).catch((err) => {
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        });
    },
};