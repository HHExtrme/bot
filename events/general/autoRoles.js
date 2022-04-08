const { MessageEmbed } = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))
const client = require("../../index");

client.on("interactionCreate", async (interaction) => {
    if (interaction.isSelectMenu()) {
        if (interaction.customId !== "autoroles") return;
        if (config.REACTION_ROLES.ENABLED == false) return;
        const roleId = interaction.values[0];
        const role = interaction.guild.roles.cache.get(roleId);
        const hasRole = interaction.member.roles.cache.has(roleId);
        await interaction.deferUpdate();
        if (hasRole) {
            const desc = mensajes.REACTION_ROLES.HAS_ROLE.DESCRIPTION.replace("{role}", role);
            const embed = new MessageEmbed()
                .setTitle(mensajes.REACTION_ROLES.HAS_ROLE.TITLE)
                .setColor(mensajes.REACTION_ROLES.HAS_ROLE.COLOR)
                .setTimestamp()
                .setDescription(desc);
            interaction.followUp({embeds: [embed], ephemeral: true});
            interaction.member.roles.remove(roleId);
        } else {
            const desc = mensajes.REACTION_ROLES.NO_ROLE.DESCRIPTION.replace("{role}", role);
            const embed = new MessageEmbed()
                .setTitle(mensajes.REACTION_ROLES.NO_ROLE.TITLE)
                .setColor(mensajes.REACTION_ROLES.NO_ROLE.COLOR)
                .setTimestamp()
                .setDescription(desc);
            interaction.followUp({embeds: [embed], ephemeral: true});
            interaction.member.roles.add(roleId);
        }
    };
})