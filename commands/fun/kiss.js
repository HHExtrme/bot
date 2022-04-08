const Discord = require('discord.js');
const superagent = require('superagent');

module.exports = {
    name: "kiss",
    permission: "KISS",
    description: "Get's a kiss reaction!",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
  run: async (client, message, args) => {
    const member = message.mentions.members.first() || message.member;
        if (member.id == message.member.id) return message.reply("You can't kiss yourself!");
        
        try {
            if (member.id === client.user.id) {
                const { body } = await superagent
                    .get("https://api.waifu.pics/sfw/slap");
                const embed2 = new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`You deserve a slapping ${message.member}!`)
                    .setImage(body.url)
                return message.reply({embeds: [embed2]});
            } else {
                const { body } = await superagent
                .get("https://api.waifu.pics/sfw/kiss");
                const embed = new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`${member} was kissed by ${message.author.tag}, how sweet!`)
                    .setImage(body.url)
                message.reply( {embeds: [embed]});   
            }
        } catch (err) {
            console.log(err);
            message.reply({embeds: [new Discord.MessageEmbed().setColor("#2f3136").setDescription(`Someting went wrong, please try again later`)]});
        }
    }
}