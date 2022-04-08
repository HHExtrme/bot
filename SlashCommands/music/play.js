const { 
    Client, 
    CommandInteraction, 
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
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const music = interaction.options.getString('song') || "Never Gonna Give You Up";
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
        interaction.reply({embeds: [new MessageEmbed().setAuthor({name: "| Searching...", iconURL: client.user.avatarURL()}).setColor("ORANGE").setDescription(mensajes.MUSIC.SEARCHING)], ephemeral: false});
        let queue = client.player.createQueue(interaction.guild.id);
        await queue.join(interaction.member.voice.channel);
        let song = await queue.play(music).catch(_ => {
            if (!guildQueue) queue.stop();
        })
        if (!song) {
            return interaction.reply({embeds: [new MessageEmbed().setAuthor({name: "| No found", iconURL: client.user.avatarURL()}).setColor("RED").setDescription(mensajes.MUSIC.NOT_FOUND)], ephemeral: true});
        }
        if (song.isFirst) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| Now playing", iconURL: client.user.avatarURL()})
                .setDescription(`[${song.name}](${song.url})`)
                .setColor("GREEN");
            return interaction.editReply({embeds: [embed]});
        } else {
            const embed = new MessageEmbed()
                .setAuthor({name: "| Added to queue", iconURL: client.user.avatarURL()})
                .setDescription(`[${song.name}](${song.url})`)
                .setColor("ORANGE");
            return interaction.editReply({embeds: [embed]});
        }
    },
};