const { 
    Client, 
    Message, 
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
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const modes = ['queue', 'song', 'none'];
        const mode = args[0];

        if (!message.member.voice.channel) {
            return message.reply({content: mensajes.MUSIC.NO_CHANNEL, ephemeral: true});
        }
        if (!message.member.voice.channel.joinable) {
            return message.reply({content: mensajes.MUSIC.NO_JOINABLE, ephemeral: true});
        }
        if (!message.member.voice.channel.speakable) {
            return message.reply({content: mensajes.MUSIC.NO_SPEAKABLE, ephemeral: true});
        }
        if (message.guild.me.voice.channel && message.member.voice.channel.id !== message.guild.me.voice.channel.id) {
            return message.reply({content: mensajes.MUSIC.NO_SAME_CHANNEL, ephemeral: true});
        }

        let guildQueue = client.player.getQueue(message.guild.id);
        if (!guildQueue) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No queue", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_QUEUE);
            return message.reply({embeds: [embed]});
        }
        if (!guildQueue.nowPlaying) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No song playing", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_SONG);
            return message.reply({embeds: [embed]});
        }
        if (!modes.includes(mode)) {
            return message.reply({embeds: [new MessageEmbed().setAuthor({name: "| Invalid mode", iconURL: client.user.avatarURL()}).setColor("RED").setDescription(mensajes.MUSIC.INVALID_MODE)]});
        }
        if (mode === 'none') {
            guildQueue.setRepeatMode(RepeatMode.DISABLED);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Loop disabled", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.LOOP_DISABLED);
            return message.reply({embeds: [embed]});
        } else if (mode === "song") {
            guildQueue.setRepeatMode(RepeatMode.SONG);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Loop song", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.LOOP_SONG);
            return message.reply({embeds: [embed]});
        } else if (mode === "queue") {
            guildQueue.setRepeatMode(RepeatMode.QUEUE);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Loop queue", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.LOOP_QUEUE);
            return message.reply({embeds: [embed]});
        }
    },
};