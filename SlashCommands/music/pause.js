const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "pause",
    permission: "PAUSE",
    description: "Pause the music",
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
            if (!guildQueue.nowPlaying) {
                const embed = new MessageEmbed()
                    .setAuthor({name: "| No song playing", iconURL: client.user.avatarURL()})                    .setColor("RED")
                    .setDescription(mensajes.MUSIC.NO_SONG);
                return interaction.reply({embeds: [embed]});
            }
            await guildQueue.setPaused(true);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Paused", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.PAUSED);
            return interaction.reply({embeds: [embed]});
        }
    },
};