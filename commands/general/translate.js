const { Client, Message, MessageEmbed } = require("discord.js");
const translate = require('@iamtraction/google-translate')

module.exports = {
    name: "translate",
    permission: "TRANSLATE",
    description: "Translates text from one language to another.",
    type: 'CHAT_INPUT',
    usage: 'translate <language> <text>',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const language = args[0];
        if (!language) return message.reply({embeds: [new MessageEmbed().setColor("#2f3136").setDescription("Please specify a language to translate to.")]});
        const text = args.slice(1).join(" ")
        if (!text) return message.reply({embeds: [new MessageEmbed().setColor("#2f3136").setDescription("Please specify text to translate.")]});
        const translated = await translate(text, { to: `${language}`});
        if (!translated) return interaction.reply({embeds: [new MessageEmbed().setDescription("Oops!, An error has occurred").setColor('RED')], ephemeral: true});
        
        const embed = new MessageEmbed()
            .setTitle(`Translation`)
            .setDescription('Here is your translation.')
            .addField('Text to translate:', `${text} `)
            .addField('Translated text:', `${translated.text} `)
            .setColor("#2f3136")
            .setFooter(`Requested by ${message.author.tag}`, message.author.displayAvatarURL());
        message.reply({embeds: [embed]});
    },
};