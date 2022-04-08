const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "troll",
    permission: "TROLL",
    description: "Troll a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'Troll a user.',
            type: 'USER',
            required: true
        },
        {
            name: 'times',
            description: 'How many times to troll.',
            type: 'NUMBER',
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
        const member = interaction.options.getMember('user');
        const sexohcf = interaction.options.getNumber('times');
        if (member) {
            interaction.reply(`Trolling ${member.user.tag} ${sexohcf} times.`);
            const random = Math.floor(Math.random() * 3) + 5;
            let str = `<@!${member.id}>`
            for (let i = 0; i < sexohcf; i++) {
                await interaction.channel.send(str.repeat(random));
            }
            interaction.editReply(`Usuario trolleado.`);
        } else {
            const embed = new MessageEmbed()
                .setTitle("Troll")
                .setDescription("You need to specify a user to troll.")
                .setColor("#ff0000");
            interaction.reply(embed);
        }
    },
};