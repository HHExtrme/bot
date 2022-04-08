const { 
    Client, 
    Message, 
    MessageEmbed 
} = require('discord.js');
const paginationEmbed = require('../../functions/paginationEmbed');

module.exports = {
    name: "editsnipe",
    permission: "EDITSNIPE",
    aliases: ["editsnipe"],
    category: ["moderation"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const channel = message.mentions.channels.first() || message.channel;
        const snipes = client.edits.get(channel.id);
        if (!snipes) return message.reply({content: "I couldn't find any messages to snipe in this channel."});

        const embeds = [];
        snipes.forEach(snipe => {
            const {msg1, msg2, image} = snipe;
            embeds.push(
                new MessageEmbed()
                    .setAuthor({name: msg1.author.tag, iconURL: msg1.author.displayAvatarURL({dynamic: true})})
                    .setImage(image)
                    .setDescription("**Previous Message:**\n```" + msg1.content + "```\n**New Message:**\n```" + msg2.content + "```")
                    .setFooter(`Requested by ${message.author.tag}`)
                    .setColor("AQUA")
            )
        })

        paginationEmbed(message, embeds, "30s", false);
    },
};