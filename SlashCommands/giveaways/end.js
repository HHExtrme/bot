const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");

module.exports = {
    name: "gend",
    permission: "GEND",
    description: "end a giveaway",
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
        client.giveawaysManager.end(messageId).then(() => {
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway ended!")]});
        }).catch((err) => {
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        });
    },
};