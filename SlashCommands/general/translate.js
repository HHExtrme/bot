const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const translate = require('@iamtraction/google-translate')

module.exports = {
    name: "translate",
    permission: "TRANSLATE",
    description: "Translates text from one language to another.",
    type: 'CHAT_INPUT',
    usage: 'translate <language> <text>',
    options: [
        {
            name: 'language',
            description: 'The language to translate to.',
            type: 'STRING',
            required: true
        },
        {
            name: 'text',
            description: 'The text to translate.',
            type: 'STRING',
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
        const language = interaction.options.getString('language')
        const query = interaction.options.getString('text')
        const translated = await translate(query, { to: `${language}`});
        if (!translated) {
            return interaction.reply({embeds: [new MessageEmbed().setDescription("Oops!, An error has occurred").setColor('RED')], ephemeral: true});
        }

        const embed = new MessageEmbed()
            .setTitle(`Translation`)
            .setDescription('Here is your translation.')
            .addField('Text to translate:', `${query} `)
            .addField('Translated text:', `${translated.text} `)
            .setColor("#2f3136")
            .setFooter(`Requested by ${interaction.user.tag}`, interaction.user.displayAvatarURL());
        interaction.reply({embeds: [embed]});
    },
};