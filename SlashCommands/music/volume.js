const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "volume",
    permission: "VOLUME",
    description: "Change the volume of the player.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'volume',
            description: 'The volume to set. Must be between 0 and 100.',
            type: 'NUMBER',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const volume = interaction.options.getNumber('volume');
        let guildQueue = client.player.getQueue(interaction.guild.id);

        if (!interaction.member.voice.channel) {
            return interaction.reply({content: mensajes.MUSIC.NO_CHANNEL, ephemeral: true});
        }
        if (!interaction.member.voice.channel.joinable) {
            return interaction.reply({content: mensajes.MUSIC.NO_JOINABLE, ephemeral: true});
        }
        if (!interaction.member.voice.channel.speakable) {
            return interaction.reply({content: mensajes.MUSIC.NO_SPEAKABLE, ephemeral: true});
        }
        if (interaction.guild.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.me.voice.channel.id) {
            return interaction.reply({content: mensajes.MUSIC.NO_SAME_CHANNEL, ephemeral: true});
        }
        
        if (!guildQueue) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No queue", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_QUEUE);
            return interaction.reply({embeds: [embed]});
        }
        if (!guildQueue.nowPlaying) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No song playing", iconURL: client.user.avatarURL()})                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_SONG);
            return interaction.reply({embeds: [embed]});
        }

        if (volume < 1 || volume > 100) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| Invalid volume", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.INVALID_VOLUME);
            return interaction.reply({embeds: [embed]});
        } else {
            guildQueue.setVolume(volume);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Volume changed", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.VOLUME_CHANGED.replace('{volume}', volume));
            return interaction.reply({embeds: [embed]});
        }
    },
};