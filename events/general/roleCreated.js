const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("roleCreate", async (role) => {
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("RoleCreated")) {
        const embed = new MessageEmbed()
        .setTitle("Role Created")
        .setFooter("Logged by: " + role.guild.me.displayName)
        .setDescription(`**Role Name:** \`${role.name}\`\n**Role ID:** \`${role.id}\`\n**Role Color:** \`${role.hexColor}\``)
        .setColor("AQUA")
        .setTimestamp();
        try {
            await role.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    }
});