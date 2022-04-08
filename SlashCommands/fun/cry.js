const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const superagent = require('superagent');

module.exports = {
    name: "cry",
    permission: "CRY",
    description: "Cry for someone",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "reason",
            description: "Reason for crying",
            type: "STRING",
            required: false,
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const reason = interaction.options.getString('reason');
        try {
            const { body } = await superagent
                .get("https://api.waifu.pics/sfw/cry");
            if (reason) {
                const embed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`${interaction.member} has been crying for ${reason}`)
                    .setImage(body.url)
                interaction.reply({embeds: [embed]});   
            } else {
                const embed = new MessageEmbed()
                    .setColor("#2f3136")
                    .setDescription(`${interaction.member} has been crying`)
                    .setImage(body.url)
                interaction.reply({embeds: [embed]});    
            }
        } catch (err) {
            console.log(err);
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`Someting went wrong, please try again later`)]});
        }
    },
};