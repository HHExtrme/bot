const { 
    Client,
    CommandInteraction,
    MessageEmbed
} = require("discord.js");

module.exports = {
    name: "dick",
    permission: "DICK",
    description: "Get size of your dick",
    type: 'CHAT_INPUT',
    options: [
        { 
            name: 'user',
            description: 'User to get dick size of',
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
        interaction.reply({embeds: [new MessageEmbed().setDescription(`${user}'s dick size is ${Math.floor(Math.random() * 30)}cm`).setColor("#2f3136")]});
    },
};