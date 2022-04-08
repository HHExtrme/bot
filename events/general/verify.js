const { MessageEmbed } = require('discord.js');
const client = require('../../index')
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId === "BTN-VERIFY") {
            if (config.VERIFY_SYSTEM.ENABLED === false) return;
            const role = config.VERIFY_SYSTEM.ROLE_ID;
            try {
                if (interaction.member.roles.cache.has(role)) {
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setAuthor({name: "Verification System"})
                                .setDescription(`You are already verified!`)
                                .setColor("#2f3136")
                        ],
                        ephemeral: true
                    })
                } else {
                    interaction.member.roles.add(role);
                    interaction.reply({
                        embeds: [
                            new MessageEmbed()
                                .setAuthor({name: "Verification System"})
                                .setDescription(`You have been verified!`)
                                .setColor("#2f3136")
                        ],
                        ephemeral: true
                    }) 
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
});