const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const { RepeatMode } = require('discord-music-player');
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "loop",
    permission: "LOOP",
    description: "Loop the current song/queue.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'mode',
            description: 'The mode of the loop. Can be "queue" or "song".',
            type: 'STRING',
            choices: [
                {
                    name: 'queue',
                    value: 'queue'
                },
                {
                    name: 'song',
                    value: 'song'
                },
                {
                    name: 'none',
                    value: 'none'
                }
            ],
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
        const mode = interaction.options.getString('mode');

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

        let guildQueue = client.player.getQueue(interaction.guild.id);
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
        if (mode === 'none') {
            guildQueue.setRepeatMode(RepeatMode.DISABLED);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Loop disabled", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.LOOP_DISABLED);
            return interaction.reply({embeds: [embed]});
        } else if (mode === "song") {
            guildQueue.setRepeatMode(RepeatMode.SONG);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Loop song", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.LOOP_SONG);
            return interaction.reply({embeds: [embed]});
        } else if (mode === "queue") {
            guildQueue.setRepeatMode(RepeatMode.QUEUE);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Loop queue", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.LOOP_QUEUE);
            return interaction.reply({embeds: [embed]});
        }
    },
};