const { 
    Client, 
    CommandInteraction, 
    MessageEmbed, 
} = require("discord.js");

module.exports = {
    name: "avatar",
    permission: "AVATAR",
    description: "Gets the avatar of a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'Get the avatar of a user.',
            type: 'USER',
            required: false
        },
        {
            name: 'user-id',
            description: 'Get the avatar of a user using id.',
            type: 'STRING',
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
        const userId = interaction.options.getString('user-id');
        
        if (userId) {
            let usera = client.users.cache.get(userId);

            const png = usera.displayAvatarURL({ dynamic: false, format: 'png' });
            const jpg = usera.displayAvatarURL({ dynamic: false, format: 'jpg' });
            const webp = usera.displayAvatarURL({ dynamic: false, format: 'webp' });
            const gif = usera.displayAvatarURL({ dynamic: true });

            const png2 = usera.displayAvatarURL({ dynamic: false, format: 'png' });
            const jpg2 = usera.displayAvatarURL({ dynamic: false, format: 'jpg' });
            const webp2 = usera.displayAvatarURL({ dynamic: false, format: 'webp' });
            const gif2 = usera.displayAvatarURL({ dynamic: true });

            const embed = new MessageEmbed()
                .setTitle(`Avatar of ${usera.tag}`)
                .setDescription(`Download the image in:\n**[png](${png}) | [jpg](${jpg}) | [gif](${gif}) | [webp](${webp})**` || `**[png](${png}) | [jpg](${jpg})**` + ` || Server Pfp: **[png](${png2}) | [jpg](${jpg2}) | [gif](${gif2}) | [webp](${webp2})**`)
                .setImage(usera.avatarURL({ dynamic: true, size: 1024 }))
                .setColor("RANDOM")
                .setFooter(usera.id)
            interaction.reply({embeds: [embed], ephemeral: false});
        } else if (user) {

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
            interaction.reply({embeds: [embed], ephemeral: false});
        }
    },
};