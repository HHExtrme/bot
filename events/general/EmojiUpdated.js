const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("emojiUpdate", async (oldEmoji, newEmoji) => {
    if (oldEmoji == newEmoji) return;
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("EmojiUpdated")) {
        if (oldEmoji.name !== newEmoji.name) {
            const embed = new MessageEmbed()
            .setTitle("Emoji Updated")
            .setFooter("Logged by: " + oldEmoji.guild.me.displayName)
            .setDescription(`**Emoji Name:** \`${oldEmoji.name}\`\n**Emoji ID:** \`${oldEmoji.id}\``)
            .setThumbnail(oldEmoji.url)
            .addField("**Old Name:**", `\`${oldEmoji.name}\``)
            .addField("**New Name:**", `\`${newEmoji.name}\``)
            .setColor("AQUA")
            .setTimestamp();
            try {
                await oldEmoji.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        }
    }
});