const { 
    Client, 
    Message, 
    MessageEmbed, 
    MessageActionRow, 
    MessageButton 
} = require('discord.js');
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

module.exports = {
  name: "vrf",
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {
    if (config.VERIFY_SYSTEM.ENABLED === false) return;
    if (!message.member.permissions.has("ADMINISTRATOR")) {
        message.channel.send("You do not have permission to use this command!")
        return;
    }
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
    try {
        message.channel.send({embeds: [embed], components: [row]});
    } catch (err) {
        console.log(err);
    }
  },
};