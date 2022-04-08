const { 
    Client,
    CommandInteraction
} = require("discord.js");

module.exports = {
    name: "ronaldo",
    permission: "RONALDO",
    description: ";)",
    type: 'CHAT_INPUT',
    aliases: ["cr7"],
    options: [],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        interaction.reply("Esto es para vosotros afición....");
        setTimeout( () => interaction.editReply("Esto es para vosotros afición....\n**SIUUUUUUUUU**"), 1500)
    },
};