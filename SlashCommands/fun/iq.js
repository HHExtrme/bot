const { 
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "iq",
    permission: "IQ",
    description: "Get IQ of a user",
    type: 'CHAT_INPUT',
    options: [
        { 
            name: 'user',
            description: 'User to get IQ of',
            type: 'USER',
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const user = interaction.options.getUser('user') || interaction.user;
        interaction.reply({embeds: [new MessageEmbed().setColor("#2f3136").setDescription(`${user}'s IQ is ${Math.floor(Math.random() * 100)}`)]});
    },
};