const { Client, Message, MessageEmbed } = require('discord.js');
const axios = require('axios');

module.exports = {
    name: "serverip",
    permission: "SERVERIP",
    aliases: ["serverip"],
    category: ["general"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const domain = args[0];
        if (!domain) {
            return message.reply({embeds: [
                new MessageEmbed()
                    .setColor("#ff0000")
                    .setDescription("Please provide a domain to get the IP of.")
            ]});
        }
        try {
            const res = await axios.get(`https://api.mcsrvstat.us/2/${domain}`);
            if (res.data.online) {
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("AQUA")
                        .setTitle("Server found!")
                        .addField("Server IP", res.data.ip, true)
                        .addField("Server Port", res.data.port.toString(), true)
                        .addField("Server Version", res.data.version, true)
                        .addField("Players Online", `${res.data.players.online}/${res.data.players.max}`, true)
                ]})
            } else {
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription("Server is offline.")
                ]})
            }
        } catch (error) {
            console.error(error);
            return message.reply({embeds: [
                new MessageEmbed()
                    .setColor("#ff0000")
                    .setDescription("Server is offline.")
            ]});
        }
    },
};