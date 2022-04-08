const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const superagent = require('superagent');
module.exports = {
    name: "hug",
    permission: "HUG",
    description: "Hug someone",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "user",
            description: "User to hug",
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
                .get("https://api.waifu.pics/sfw/hug");
            const embed = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`<@!${interaction.member.id}> has been hugging <@!${user.id}>`)
                .setImage(body.url)
            interaction.reply({embeds: [embed]});
        } catch (err) {
            console.log(err);
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`Someting went wrong, please try again later`)]});
        }
    },
};