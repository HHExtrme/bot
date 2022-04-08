const { 
    Client, 
    Message, 
    MessageEmbed 
} = require('discord.js');

module.exports = {
    name: "snipe",
    permission: "SNIPE",
    aliases: ["snipe"],
    category: ["moderation"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const channel = message.mentions.channels.first() || message.channel;
        const snipes = client.snipes.get(channel.id);
        if (!snipes) return message.reply({content: "I couldn't find any messages to snipe in this channel."});

        const embeds = [];
        snipes.forEach(snipe => {
            const {msg, image} = snipe;
            embeds.push(
                new MessageEmbed()
                    .setAuthor({name: msg.author.tag, iconURL: msg.author.displayAvatarURL()})
                    .setImage(image)
                    .setDescription(msg.content ? "**Message:**\n```" + msg.content + "```" : "*No message content.*")
                    .setFooter(`Requested by ${message.author.tag}`)
                    .setColor("AQUA")
            )
        })

        paginationEmbed(message, embeds, "30s", false);
    },
};