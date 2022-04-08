const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");

module.exports = {
    name: "screenshot",
    permission: "SCREENSHOT",
    description: "Take a screenshot of a website.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const url = args.join(' ');
        const urlRegex = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/gm;
        if (!urlRegex.test(url)) {
            message.reply("Invalid URL.");
            return;
        } else {
            const embed = new MessageEmbed()
                .setColor("#2f3136")
                .setDescription(`Screenshot take correctly.`)
                .setImage(`https://api-fg.ddns.net/api/v3/news/screenshot?url=${url}`)
                .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
            message.reply({embeds: [embed]});
        }
    },
};