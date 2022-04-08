const Discord = require('discord.js');
const superagent = require('superagent');

module.exports = {
    name: "kiss",
    permission: "KISS",
    description: "Get's a kiss reaction!",
    options: [
        {
            name: "user",
            description: "The user to kiss",
            type:"USER",
            required: true,
        }, 
    ],
  run: async (client, interaction, args) => {

    const member = interaction.options.getMember('user');
        if (member.id == interaction.member.id) return interaction.reply("You can't kiss yourself!");
        
        try {
            if (member.id === client.user.id) {
                const { body } = await superagent
                    .get("https://api.waifu.pics/sfw/slap");
                const embed2 = new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`You deserve a slapping ${interaction.member}!`)
                    .setImage(body.url)
                return interaction.reply({embeds: [embed2]});
            } else {
                const { body } = await superagent
                .get("https://api.waifu.pics/sfw/kiss");
                const embed = new Discord.MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`${member} was kissed by ${interaction.user.tag}, how sweet!`)
                    .setImage(body.url)
                interaction.reply( {embeds: [embed]});   
            }
        } catch (err) {
            console.log(err);
            interaction.reply({embeds: [new MessageEmbed().setColor("#2f3136").setDescription(`Someting went wrong, please try again later`)]});
        }
    }
}