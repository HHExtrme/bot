const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "skip",
    permission: "SKIP",
    description: "Skip a song",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let guildQueue = client.player.getQueue(interaction.guild.id);
        if (!guildQueue) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No queue", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_QUEUE);
            return interaction.reply({embeds: [embed]});
        } else {
            await guildQueue.skip();
            const embed = new MessageEmbed()
                .setAuthor({name: "| Skipped", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.SKIPPED);
            return interaction.reply({embeds: [embed]});
        }
    },
};