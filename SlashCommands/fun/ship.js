const block = "⬛";
const heart = ":red_square:";
const { MessageEmbed } = require("discord.js");

module.exports = {
    name: "ship",
    permission: "SHIP",
    description: "Find out how much 2 people love each other!",
    options: [
        {
            name: "one",
            description: "The first user",
            type: "USER",
            required: true
        },
        {
            name: "two",
            description: "The second user",
            type: "USER",
            required: true
        }
    ],
    run: async (client, interaction, args) => {
        const user1 = interaction.options.getUser("one"), user2 = interaction.options.getUser("two")
        if (user1.id === user2.id) return interaction.reply("The same user is not allowed to ship!")
        try {
            const embed = new MessageEmbed()
                .setColor('dd2e44')
                .setTitle('Shipping...')
                .setDescription(`Shipped ****${user1.tag}**** and ****${user2.tag}****!`)
                .setImage(`https://api.popcat.xyz/ship?user1=${user1.displayAvatarURL({ dynamic: false, format: "png" })}&user2=${user2.displayAvatarURL({ dynamic: false, format: "png" })}`)
                .addField(`**Ship Meter**`, ship());
            await interaction.reply({ embeds: [embed] })
        } catch (error) {
            await interaction.reply({ content: "An Error Occured" })
        }
        function ship() {
            const hearts = Math.floor(Math.random() * 110) + 0;
            const hearte = (hearts / 10)
            const str = `${heart.repeat(hearte)}${block.repeat(11 - hearte)} ${hearts}%`;
            return str;
        }
    }
}