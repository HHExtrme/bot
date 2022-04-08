const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "play",
    permission: "PLAY",
    description: "Play a song",
    usage: "play <song name>",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'song',
            description: 'The song to play.',
            type: 'STRING',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const music = args.join(" ")
        if (!music) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No song", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription(mensajes.MUSIC.NOT_FOUND);
            return message.reply({embeds: [embed]});
        }
        
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
        const a = message.reply({embeds: [new MessageEmbed().setAuthor({name: "| Searching...", iconURL: client.user.avatarURL()}).setColor("ORANGE").setDescription(mensajes.MUSIC.SEARCHING)], ephemeral: false});
        let queue = client.player.createQueue(message.guild.id);
        await queue.join(message.member.voice.channel);
        let song = await queue.play(music).catch(_ => {
            if (!guildQueue) queue.stop();
        })
        if (!song) {
            return message.reply({embeds: [new MessageEmbed().setAuthor({name: "| No found", iconURL: client.user.avatarURL()}).setColor("RED").setDescription(mensajes.MUSIC.NOT_FOUND)], ephemeral: true});
        }
        if (song.isFirst) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| Now Playing", iconURL: client.user.avatarURL()})
                .setDescription(`[${song.name}](${song.url})`)
                .setColor("GREEN");
            return (await a).edit({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
                .setAuthor({name: "| Add to queue", iconURL: client.user.avatarURL()})
                .setDescription(`[${song.name}](${song.url})`)
                .setColor("ORANGE");
            return (await a).edit({embeds: [embed]});
        }
    },
};