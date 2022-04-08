const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("roleUpdate", async (oldRole, newRole) => {
    if (oldRole == newRole) return;
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("RoleUpdated")) {
        if (oldRole.name !== newRole.name) {
            const embed = new MessageEmbed()
            .setTitle("Role Updated")
            .setFooter("Logged by: " + oldRole.guild.me.displayName)
            .setColor("AQUA")
            .addField("**Role:**", `<@&${oldRole.id}>`)
            .addField("**Old Name:**", `\`${oldRole.name}\``)
            .addField("**New Name:**", `\`${newRole.name}\``)
            .setTimestamp();
            try {
                oldRole.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        } else if (oldRole.color !== newRole.color) {
            const embed = new MessageEmbed()
            .setTitle("Role Updated")
            .setFooter("Logged by: " + oldRole.guild.me.displayName)
            .setColor("AQUA")
            .addField("**Role:**", `<@&${oldRole.id}>`)
            .addField("**Old Color:**", `\`${oldRole.hexColor}\``)
            .addField("**New Color:**", `\`${newRole.hexColor}\``)
            .setTimestamp();
            try {
                oldRole.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
            } catch (error) {
                console.error(error);
            }
        }
    }
});