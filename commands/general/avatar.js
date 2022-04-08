const { 
    Client, 
    Message, 
    MessageEmbed, 
} = require("discord.js");

module.exports = {
    name: "avatar",
    permission: "AVATAR",
    description: "Gets the avatar of a user.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.client.users.cache.get(args[0]) || message.author;
        
        const png = user.displayAvatarURL({ dynamic: false, format: 'png' });
        const jpg = user.displayAvatarURL({ dynamic: false, format: 'jpg' });
        const webp = user.displayAvatarURL({ dynamic: false, format: 'webp' });
        const gif = user.displayAvatarURL({ dynamic: true });
        const png2 = user.displayAvatarURL({ dynamic: false, format: 'png' });
        const jpg2 = user.displayAvatarURL({ dynamic: false, format: 'jpg' });
        const webp2 = user.displayAvatarURL({ dynamic: false, format: 'webp' });
        const gif2 = user.displayAvatarURL({ dynamic: true });
        const embed = new MessageEmbed()
            .setTitle(`Avatar of ${user.tag}`)
            .setDescription(`Download the image in:\n**[png](${png}) | [jpg](${jpg}) | [gif](${gif}) | [webp](${webp})**` || `**[png](${png}) | [jpg](${jpg})**` + ` || Server Pfp: **[png](${png2}) | [jpg](${jpg2}) | [gif](${gif2}) | [webp](${webp2})**`)
            .setImage(user.avatarURL({ dynamic: true, size: 1024 }))
            .setColor("RANDOM")
            .setFooter(user.id)
        message.reply({embeds: [embed], ephemeral: false});
    },
};