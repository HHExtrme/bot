const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const { API_ZERO } = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

module.exports = {
    name: "dripping",
    permission: "DRIPPING",
    description: "dripping",
    options: [
        {
            name: 'user',
            description: 'user',
            type: 'USER',
            required: false
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const user = interaction.options.getUser('user') || interaction.user;
        const image = `https://api.notzerotwo.ml/image/drip?api=${API_ZERO}&avatar=${user.avatarURL({ dynamic: true })}`

        const embed = new MessageEmbed()
            .setColor('#2f3136')
            .setImage(image)
            .setTitle(`${user.username} is dripping`);
        interaction.reply({embeds: [embed]});
    },
};