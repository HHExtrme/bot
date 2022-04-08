const { MessageEmbed } = require('discord.js');
const client = require('../../index')
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2));
const API_ZERO = config.API_KEYS.ZERO_TWO;
const pool = require('../../functions/captchaServer');

client.on("guildMemberAdd", async (member) => {
    if (config.VERIFY_WEB_SYSTEM.ENABLED) {
        try {
            const linkID = pool.createLink(member.id);
            const embed2 = new MessageEmbed()
                .setAuthor({name: "Verification System"})
                .addField("Origin server", member.guild.name, true)
                .addField("Status", `[Waiting, click me to verify](${client.config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.HTTPS ? 'https://' : 'http://'}${client.config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.DOMAIN + ":" + client.config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.WEB_PORT}/verify/${linkID})`, true)
                .setImage("https://media.discordapp.net/attachments/818019345078419486/864549367825039370/verification_screen.PNG?width=794&height=473")
                .setColor("2f3136");
            await member.send({ embeds: [embed2] })
        } catch (error) {
            const embed2 = new MessageEmbed()
                .setImage("https://i.postimg.cc/FHC5bfsB/how-to-enable-dms.png")
                .setColor("2f3136");
            client.channels.cache.get(client.config.VERIFY_WEB_SYSTEM.CHANNEL_ID).send({ embeds: [embed2], content: `<@!${member.id}>` })
            console.error(`Failed to send captcha to ${member.user.tag}! (Maybe they have DMs turned off?)`);
        }
    }
    if (config.AUTOROLE.MEMBER.ENABLED) {
        let role = member.guild.roles.cache.find(r => r.id === config.AUTOROLE.MEMBER.ROLE_ID)
        if (role) {
            member.roles.add(role)
        }
    }
    if (config.AUTOROLE.BOT.ENABLED) {
        let role = member.guild.roles.cache.find(r => r.id === config.AUTOROLE.BOT.ROLE_ID)
        if (role) {
            if (member.user.bot) {
                member.roles.add(role)
            }
        }
    }
    if (config.WELCOME_SYSTEM.ENABLED) {
        let channel = member.guild.channels.cache.find(c => c.id === config.WELCOME_SYSTEM.CHANNEL_ID)
        if (channel) {
            const color = config.WELCOME_SYSTEM.MESSAGE_EMBED.COLOR
            const title = config.WELCOME_SYSTEM.MESSAGE_EMBED.TITLE.replace("{server-name}", member.guild.name)
            const description = config.WELCOME_SYSTEM.MESSAGE_EMBED.DESCRIPTION.replace("{user-mention}", `<@${member.id}>`).replace("{server-name}", member.guild.name).replace("{user-name}", member.user.username).replace("{member-count}", member.guild.memberCount)
            const footer = config.WELCOME_SYSTEM.MESSAGE_EMBED.FOOTER.replace("{user-name}", member.user.username).replace("{user-id}", member.id).replace("{server-name}", member.guild.name).replace("{member-count}", member.guild.memberCount).replace("{user-tag}", member.user.tag)
            const thumbnail = config.WELCOME_SYSTEM.MESSAGE_EMBED.THUMBNAIL.replace("{user-pfp}", member.user.avatarURL()).replace("{bot-pfp}", client.user.avatarURL()).replace("{server-pfp}", member.guild.iconURL())
            const image = config.WELCOME_SYSTEM.MESSAGE_EMBED.IMAGE.replace("{user-pfp}", member.user.avatarURL()).replace("{bot-pfp}", client.user.avatarURL()).replace("{server-pfp}", member.guild.iconURL())
            const timestamp = config.WELCOME_SYSTEM.MESSAGE_EMBED.TIMESTAMP
            const embed = new MessageEmbed()
                .setColor(color)
                .setTitle(title)
                .setDescription(description)
                .setFooter(footer)
                if (thumbnail) {
                    if (thumbnail.startsWith("http")) {
                        embed.setThumbnail(thumbnail)
                    }
                }
                if (image) {
                    if (image == "{card-image}") {
                        const image = `https://api.notzerotwo.ml/image/welcomecard?api=${API_ZERO}&avatar=${member.displayAvatarURL({format: "jpg"})}&guildname=${encodeURI(member.guild.name)}&name=${encodeURI(member.user.username)}&discriminator=${member.user.discriminator}&counter=${member.guild.memberCount}`
                        embed.setImage(image)
                    } else {
                        if (image.startsWith("http")) {
                            embed.setImage(image)
                        }
                    }
                }
                if (timestamp) embed.setTimestamp()
            channel.send({embeds: [embed]})
        }
    }
});