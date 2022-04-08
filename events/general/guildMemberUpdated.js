const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("guildMemberUpdate", async (oldMember, newMember) => {
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("GuildMemberUpdated")) {
        if (oldMember.nickname !== newMember.nickname) {
            const embed = new MessageEmbed()
            .setTitle("Nickname Changed")
            .setFooter("Logged by: " + newMember.guild.me.displayName)
            .addField("**Member:**", `<@${newMember.id}> \`[${newMember.user.tag}]\``)
            .addField("**Old Nickname:**", oldMember.nickname || "None")
            .addField("**New Nickname:**", newMember.nickname || "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newMember.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
            const embed = new MessageEmbed()
            .setTitle("Roles Updated")
            .setFooter("Logged by: " + newMember.guild.me.displayName)
            .addField("**Member:**", `<@${newMember.id}> \`[${newMember.user.tag}]\``)
            .addField("**Old Roles:**", oldMember.roles.cache.map(r => `<@&${r.id}>`).join(" ") || "None")
            .addField("**New Roles:**", newMember.roles.cache.map(r => `<@&${r.id}>`).join(" ") || "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newMember.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldMember.user.avatarURL !== newMember.user.avatarURL) {
            const embed = new MessageEmbed()
            .setTitle("Avatar Updated")
            .setFooter("Logged by: " + newMember.guild.me.displayName)
            .addField("**Member:**", `<@${newMember.id}> \`[${newMember.user.tag}]\``)
            .addField("**Old Avatar:**", oldMember.user.avatarURL || "None")
            .addField("**New Avatar:**", newMember.user.avatarURL || "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newMember.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldMember.user.tag !== newMember.user.tag) {
            const embed = new MessageEmbed()
            .setTitle("Username Updated")
            .setFooter("Logged by: " + newMember.guild.me.displayName)
            .addField("**Member:**", `<@${newMember.id}> \`[${newMember.user.tag}]\``)
            .addField("**Old Username:**", oldMember.user.tag || "None")
            .addField("**New Username:**", newMember.user.tag || "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newMember.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldMember.user.banner !== newMember.user.banner) {
            const embed = new MessageEmbed()
            .setTitle("Banner Updated")
            .setFooter("Logged by: " + newMember.guild.me.displayName)
            .addField("**Member:**", `<@${newMember.id}> \`[${newMember.user.tag}]\``)
            .addField("**Old Banner:**", oldMember.user.banner || "None")
            .addField("**New Banner:**", newMember.user.banner || "None")
            .setColor("AQUA")
            .setTimestamp();
            try {
                await newMember.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        }
    }
});