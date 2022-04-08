const { 
    Client, 
    CommandInteraction, 
    MessageEmbed, MessageActionRow, MessageButton,
} = require("discord.js");

const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

if (config.VERIFY_SYSTEM.ENABLED === false) return;
module.exports = {
    name: "vrf",
    permission: "VRF",
    description: "Send the verify panel.",
    type: 'CHAT_INPUT',
    options: [],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const embed = new MessageEmbed()
            .setAuthor({name: config.VERIFY_SYSTEM.EMBED_CONFIG.TITLE})
            .setDescription(config.VERIFY_SYSTEM.EMBED_CONFIG.DESCRIPTION)
            .setColor(config.VERIFY_SYSTEM.EMBED_CONFIG.COLOR)
        const row = new MessageActionRow().addComponents(
            new MessageButton()
                .setLabel(config.VERIFY_SYSTEM.BUTTON.LABEL)
                .setCustomId("BTN-VERIFY")
                .setEmoji(config.VERIFY_SYSTEM.BUTTON.EMOJI)
                .setStyle(config.VERIFY_SYSTEM.BUTTON.STYLE)
        )

        interaction.reply({embeds: [embed], components: [row]})
    },
};