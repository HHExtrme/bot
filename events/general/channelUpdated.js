const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("channelUpdate", async (oldChannel, newChannel) => {
    if (oldChannel == newChannel) return;
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("ChannelUpdated")) {
        if (oldChannel.name !== newChannel.name) {
            const embed = new MessageEmbed()
            .setTitle("Channel Name Updated")
            .setFooter("Logged by: " + newChannel.guild.me.displayName)
            .addField("**Channel:**", `<#${newChannel.id}>`)
            .addField("**Old Name:**", oldChannel.name || "None")
            .addField("**New Name:**", newChannel.name || "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newChannel.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldChannel.topic !== newChannel.topic) {
            const embed = new MessageEmbed()
            .setTitle("Channel Topic Updated")
            .setFooter("Logged by: " + newChannel.guild.me.displayName)
            .addField("**Channel:**", `<#${newChannel.id}>`)
            .addField("**Old Topic:**", oldChannel.topic || "None")
            .addField("**New Topic:**", newChannel.topic || "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newChannel.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldChannel.nsfw !== newChannel.nsfw) {
            const embed = new MessageEmbed()
            .setTitle("Channel NSFW Updated")
            .setFooter("Logged by: " + newChannel.guild.me.displayName)
            .addField("**Channel:**", `<#${newChannel.id}>`)
            .addField("**Old NSFW:**", oldChannel.nsfw.toString())
            .addField("**New NSFW:**", newChannel.nsfw.toString())
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newChannel.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldChannel.parentID !== newChannel.parentID) {
            const embed = new MessageEmbed()
            .setTitle("Channel Category Updated")
            .setFooter("Logged by: " + newChannel.guild.me.displayName)
            .addField("**Channel:**", `<#${newChannel.id}>`)
            .addField("**Old Category:**", oldChannel.parentID ? `<#${oldChannel.parentID}>` : "None")
            .addField("**New Category:**", newChannel.parentID ? `<#${newChannel.parentID}>` : "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newChannel.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        }
    }
});