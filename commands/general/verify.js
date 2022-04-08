const { Client, Message, MessageEmbed } = require('discord.js');
const pool = require('../../functions/captchaServer')

module.exports = {
    name: "verify",
    permission: "VERIFY",
    aliases: ["verify"],
    category: ["general"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        if (!client.config.VERIFY_WEB_SYSTEM.ENABLED) return;
        if (message.channel.id !== client.config.VERIFY_WEB_SYSTEM.CHANNEL_ID) return;

        if (message.member.roles.cache.some(r => client.config.VERIFY_WEB_SYSTEM.ROLE_ID.includes(r.id))) {
            return message.channel.send("Ups, you already verified!");
        }
        try {
            const linkID = pool.createLink(message.author.id);
            const embed2 = new MessageEmbed()
                .setAuthor({name: "Verification System"})
                .addField("Origin server", message.guild.name, true)
                .addField("Status", `[Waiting, click me to verify](${client.config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.HTTPS ? 'https://' : 'http://'}${client.config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.DOMAIN + ":" + client.config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.WEB_PORT}/verify/${linkID})`, true)
                .setImage("https://media.discordapp.net/attachments/818019345078419486/864549367825039370/verification_screen.PNG?width=794&height=473")
                .setColor("2f3136");
            await message.author.send({ embeds: [embed2] }).then(() => {
                message.react("✅")
            })
        } catch (error) {
            const embed2 = new MessageEmbed()
                .setImage("https://images-ext-1.discordapp.net/external/Z3GOqSJbPqNUYulPKh1uRYwXLnE1j0byxf6CLz9M14E/https/i.postimg.cc/FHC5bfsB/how-to-enable-dms.png")
                .setColor("2f3136");
            client.channels.cache.get(client.config.VERIFY_WEB_SYSTEM.CHANNEL_ID).send({ embeds: [embed2], content: `<@!${message.author.id}>` })
            console.error(`Failed to send captcha to ${message.author.tag}! (Maybe they have DMs turned off?)`);
        }
    },
};