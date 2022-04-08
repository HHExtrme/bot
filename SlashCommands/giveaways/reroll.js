const { 
    Client, 
    CommandInteraction, 
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
        client.giveawaysManager.reroll(messageId, {
            winnerCount: client.config.GIVEAWAYS.REROLL_WINNERS,
            messages: {
                congrat: mensajes.GIVEAWAYS.NEW_WINNERS.replace("{prize}", "{this.prize}").replace("{url}", "{this.messageURL}")
            }
        }).then(() => {
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway rerolled!")]});
        }).catch((err) => {
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        });
    },
};