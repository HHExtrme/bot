const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");

module.exports = {
    name: "screenshot",
    permission: "SCREENSHOT",
    description: "Take a screenshot of a website.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'url',
            description: 'The URL of the website to screenshot.',
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
        const url = interaction.options.getString('url');
        const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
        if (!urlRegex.test(url)) {
            interaction.reply("Invalid URL.");
            return;
        } else {
            const embed = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`Screenshot take correctly.`)
                .setImage(`https://api-fg.ddns.net/api/v3/news/screenshot?url=${url}`)
                .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
            interaction.reply({embeds: [embed]});
        }
    },
};