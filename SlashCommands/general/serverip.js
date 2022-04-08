const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const axios = require("axios");

module.exports = {
    name: "serverip",
    permission: "SERVER_IP",
    description: "Check a minecraft server's IP.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'domain',
            description: 'The domain of the server.',
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
        await interaction.deferReply();
        const domain = interaction.options.getString('domain');
        if (!domain) {
            return interaction.followUp({embeds: [
                new MessageEmbed()
                    .setColor("#ff0000")
                    .setDescription("Please provide a domain to get the IP of.")
            ]});
        }
        try {
            const res = await axios.get(`https://api.mcsrvstat.us/2/${domain}`);
            if (res.data.online) {
                return interaction.followUp({embeds: [
                    new MessageEmbed()
                        .setColor("AQUA")
                        .setTitle("Server found!")
                        .addField("Server IP", res.data.ip, true)
                        .addField("Server Port", res.data.port.toString(), true)
                        .addField("Server Version", res.data.version, true)
                        .addField("Players Online", `${res.data.players.online}/${res.data.players.max}`, true)
                ]})
            } else {
                return interaction.followUp({embeds: [
                    new MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription("Server is offline.")
                ]})
            }
        } catch (error) {
            console.error(error);
            return interaction.followUp({embeds: [
                new MessageEmbed()
                    .setColor("#ff0000")
                    .setDescription("Server is offline.")
            ]});
        }
    },
};