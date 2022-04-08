const { MessageEmbed, MessageAttachment } = require('discord.js');
const client = require('../../index')
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))
const API_ZERO = config.API_KEYS.ZERO_TWO;

client.on("guildMemberRemove", async (member) => {
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (member.guild.id !== config.GUILD_ID) return;
    if (config.LEAVE_SYSTEM.ENABLED) {
        let channel = member.guild.channels.cache.find(c => c.id === config.LEAVE_SYSTEM.CHANNEL_ID)
        if (!channel) return;
        const color = config.LEAVE_SYSTEM.MESSAGE_EMBED.COLOR
        const title = config.LEAVE_SYSTEM.MESSAGE_EMBED.TITLE.replace("{server-name}", member.guild.name)
        const description = config.LEAVE_SYSTEM.MESSAGE_EMBED.DESCRIPTION.replace("{user-mention}", `<@${member.id}>`).replace("{server-name}", member.guild.name).replace("{user-name}", member.user.username).replace("{member-count}", member.guild.memberCount)
        const footer = config.LEAVE_SYSTEM.MESSAGE_EMBED.FOOTER.replace("{user-name}", member.user.username).replace("{user-id}", member.id).replace("{server-name}", member.guild.name).replace("{member-count}", member.guild.memberCount).replace("{user-tag}", member.user.tag)
        const thumbnail = config.LEAVE_SYSTEM.MESSAGE_EMBED.THUMBNAIL.replace("{user-pfp}", member.user.avatarURL()).replace("{bot-pfp}", client.user.avatarURL()).replace("{server-pfp}", member.guild.iconURL())
        const image = config.WELCOME_SYSTEM.MESSAGE_EMBED.IMAGE.replace("{user-pfp}", member.user.avatarURL()).replace("{bot-pfp}", client.user.avatarURL()).replace("{server-pfp}", member.guild.iconURL())
        const timestamp = config.LEAVE_SYSTEM.MESSAGE_EMBED.TIMESTAMP

        let embed = new MessageEmbed()
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
                    const image = `https://api.notzerotwo.ml/image/leavecard?api=${API_ZERO}&avatar=${member.displayAvatarURL({format: "jpg"})}&guildname=${encodeURI(member.guild.name)}&name=${encodeURI(member.user.username)}&discriminator=${member.user.discriminator}&counter=${member.guild.memberCount}`
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
});