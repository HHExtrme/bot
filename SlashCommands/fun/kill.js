const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const superagent = require('superagent');

module.exports = {
    name: "kill",
    permission: "KILL",
    description: "kill someone",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "user",
            description: "User to kill",
            type: "USER",
            required: true,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const user = interaction.options.getUser('user');
        try {
            const { body } = await superagent
                .get("https://api.waifu.pics/sfw/kill");
            const embed = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`<@!${interaction.member.id}> has killed <@!${user.id}>`)
                .setImage(body.url)
            interaction.reply({embeds: [embed]});
        } catch (error) {
            console.log(error);
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`Someting went wrong, please try again later`)]});
        }
    },
};