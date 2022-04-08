const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("channelCreate", async (channel) => {
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("ChannelCreated")) {
        const embed = new MessageEmbed()
        .setTitle("Channel Created")
        .setFooter("Logged by: " + channel.guild.me.displayName)
        .addField("**Channel:**", `<#${channel.id}>`)
        .addField("**Channel Name:**", channel.name.toString())
        .addField("**Channel Type:**", channel.type.toString().replace("GUILD_TEXT", "Text Channel").replace("DM", "Direct Message").replace("GUILD_VOICE", "Voice Channel").replace("GUILD_CATEGORY", "Category Channel").replace("GUILD_NEWS", "News Channel").replace("GUILD_STORE", "Store Channel"))
        .setColor("AQUA")
        .setTimestamp();
        try {
            await channel.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
})