const { 
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");
const superagent = require('superagent');

module.exports = {
    name: 'bonk',
    permission: 'BONK',
    description: 'bonks people no horni',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) {
            return message.reply({content: "Please mention a valid member of this server", ephemeral: true});
        }
        if (member.id == message.member.id) return message.reply('You cannot bonk yourself')
        try {
            const { body } = await superagent
                    .get("https://api.waifu.pics/sfw/bonk");
            const embed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`${member} has been bonked by ${message.member}`)
                    .setImage(body.url)
            if (member.id === client.user.id) {return message.reply(`${message.member}, you can't bonk me!`);}
            message.reply({embeds: [embed]});    
        } catch (err) {
            console.log(err);
            message.reply({embeds: [new MessageEmbed().setColor("#2f3136").setDescription(`Someting went wrong, please try again later`)]});
        }
    }
}