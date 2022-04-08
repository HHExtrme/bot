const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "nuke",
    permission: "NUKE",
    description: "Nuke a channel",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'channel',
            description: 'The channel to nuke',
            type: 'CHANNEL',
            channelTypes: ["GUILD_TEXT"],
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        const channel = interaction.options.getChannel('channel') || interaction.channel;
        const msgNuke = new MessageEmbed()
            .setColor("#2f3136")
            .setTitle("Channel Nuked")
            .setDescription("This channel has been nuked.")
            .setTimestamp();

        let posicion = channel.position;
        try {
            channel.clone().then((ch) => {
                channel.delete();
                ch.setPosition(posicion);
                ch.send({embeds: [msgNuke]});
            });
            interaction.reply("Channel nuked.");
        } catch (err) {
            interaction.reply("I can't nuke this channel.");
        }
    },
};