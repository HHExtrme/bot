const { 
    Client, 
    Message, 
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
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const arg = args[0];
        if (!arg) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No volume", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_VOLUME);
            return message.reply({embeds: [embed]});
        }
        const volume = parseInt(arg);
        let guildQueue = client.player.getQueue(message.guild.id);

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
        
        if (!guildQueue) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No queue", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_QUEUE);
            return message.reply({embeds: [embed]});
        }
        if (!guildQueue.nowPlaying) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No song playing", iconURL: client.user.avatarURL()})                .setColor("RED")
                .setDescription(mensajes.MUSIC.NO_SONG);
            return message.reply({embeds: [embed]});
        }

        if (volume < 1 || volume > 100) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| Invalid volume", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.INVALID_VOLUME);
            return message.reply({embeds: [embed]});
        } else {
            guildQueue.setVolume(volume);
            const embed = new MessageEmbed()
                .setAuthor({name: "| Volume changed", iconURL: client.user.avatarURL()})
                .setColor("GREEN")
                .setDescription(mensajes.MUSIC.VOLUME_CHANGED.replace('{volume}', volume));
            return message.reply({embeds: [embed]});
        }
    },
};