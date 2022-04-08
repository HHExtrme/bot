const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

module.exports = {
    name: "poll",
    permission: "POLL",
    description: "Create a poll",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "question",
            description: "The question of the poll",
            type: "STRING",
            required: true
        },
        {
            name: "description",
            description: "The description of the poll",
            type: "STRING",
            required: true
        },
        {
            name: "option-1",
            description: "The first option of the poll",
            type: "STRING",
            required: true
        },
        {
            name: "option-2",
            description: "The second option of the poll",
            type: "STRING",
            required: true
        },
        {
            name: "option-3",
            description: "The third option of the poll",
            type: "STRING",
            required: false
        },
        {
            name: "option-4",
            description: "The fourth option of the poll",
            type: "STRING",
            required: false
        },
        {
            name: "option-5",
            description: "The fifth option of the poll",
            type: "STRING",
            required: false
        },
        {
            name: "option-6",
            description: "The sixth option of the poll",
            type: "STRING",
            required: false
        },
        {
            name: "option-7",
            description: "The seventh option of the poll",
            type: "STRING",
            required: false
        },
        {
            name: "option-8",
            description: "The eighth option of the poll",
            type: "STRING",
            required: false
        },
        {
            name: "option-9",
            description: "The ninth option of the poll",
            type: "STRING",
            required: false
        },
        {
            name: "option-10",
            description: "The tenth option of the poll",
            type: "STRING",
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const question = interaction.options.getString("question");
        const option1 = interaction.options.getString("option-1");
        const option2 = interaction.options.getString("option-2");
        const option3 = interaction.options.getString("option-3") || null;
        const option4 = interaction.options.getString("option-4") || null;
        const option5 = interaction.options.getString("option-5") || null;
        const option6 = interaction.options.getString("option-6") || null;
        const option7 = interaction.options.getString("option-7") || null;
        const option8 = interaction.options.getString("option-8") || null;
        const option9 = interaction.options.getString("option-9") || null;
        const option10 = interaction.options.getString("option-10") || null;
        const description = interaction.options.getString("description") || "";

        const reactions = config.POLL_SYSTEM.EMOJIS;
        const opts = [option1 ? option1 : option1, option2 ? option2 : option1, option3 ? option3 : option1, option4 ? option4 : option1, option5 ? option5 : option1, option6 ? option6 : option1, option7 ? option7 : option1, option8 ? option8 : option1, option9 ? option9 : option1, option10 ? option10 : option1];
        const optsUnique = [...new Set(opts)];

        const embed = new MessageEmbed()
            .setColor("#2f3136")
            .setTitle(`__**📊 Poll | ${description}**__`)
            .setDescription(`${question}\n\n${optsUnique.map((option) => `${reactions[opts.indexOf(option)]} **»** ${option}`).join("\n")}\n\nReact with the corresponding emoji to vote!`)
            .setFooter("Poll created by " + interaction.user.tag, interaction.member.user.displayAvatarURL());
        
        let channelData = interaction.guild.channels.cache.get(config.POLL_SYSTEM.CHANNEL_ID);
        let msg = channelData.send({embeds: [embed]}).then(async message => {
            for (const option of optsUnique) {
                await message.react(reactions[opts.indexOf(option)]);
            }
        });
        interaction.reply({embeds: [new MessageEmbed().setDescription(`Poll created! [Message Here!](https://discord.com/channels/${interaction.guild.id}/${channelData.id}/${msg.id})`).setColor("#2f3136")]});
    },
};