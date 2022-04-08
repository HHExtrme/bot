const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("emojiDelete", async (emoji) => {
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("EmojiDeleted")) {
        const embed = new MessageEmbed()
        .setTitle("Emoji Deleted")
        .setFooter("Logged by: " + emoji.guild.me.displayName)
        .setDescription(`**Emoji Name:** \`${emoji.name}\`\n**Emoji ID:** \`${emoji.id}\``)
        .setThumbnail(emoji.url)
        .setColor("AQUA")
        .setTimestamp();
        try {
            await emoji.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
});