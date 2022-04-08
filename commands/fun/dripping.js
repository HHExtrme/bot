const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const API_ZERO = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2)).API_KEYS.ZERO_TWO;

module.exports = {
    name: "dripping",
    permission: "DRIPPING",
    description: "dripping",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const user = message.mentions.users.first() || message.user;
        const image = `https://api.notzerotwo.ml/image/drip?api=${API_ZERO}&avatar=${user.avatarURL({ dynamic: true })}`

        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setImage(image)
            .setTitle(`${user.username} is dripping`);
        message.reply({embeds: [embed]});
    },
};