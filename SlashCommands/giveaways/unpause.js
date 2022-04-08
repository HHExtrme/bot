const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");

module.exports = {
    name: "gunpause",
    permission: "GUNPAUSE",
    description: "unpause a giveaway",
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

        client.giveawaysManager.unpause(messageId).then(() => {
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Giveaway unpaused!")]});
        }).catch((error) => {
            interaction.reply(`An error has occurred, please check and try again.\n\`${error}\``);
        })
    },
};