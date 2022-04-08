const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const superagent = require('superagent');

module.exports = {
    name: 'bonk',
    permission: 'BONK',
    description: 'bonks people no horni',
    options: [
        {
            name: "user",
            description: "User to get information from",
            type:"USER",
            required: true,
        }, 
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const member = interaction.options.getMember('user');
        if (member.id == interaction.member.id) return interaction.reply('You cannot bonk yourself')
        if (member.id === client.user.id) {return interaction.reply(`${interaction.member}, naonao, you can't bonk me!`);}
        try {
            const { body } = await superagent
                    .get("https://api.waifu.pics/sfw/bonk");
            const embed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`${member} has been bonked by ${interaction.member}`)
                    .setImage(body.url)
            interaction.reply({embeds: [embed]});    
        } catch (err) {
            console.log(err);
            interaction.reply({embeds: [new MessageEmbed().setColor("#2f3136").setDescription(`Someting went wrong, please try again later`)]});
        }
    }
}