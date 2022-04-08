const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const ms = require('ms');

module.exports = {
    name: "timeout",
    permission: "TIMEOUT",
    description: "Timeouts a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to timeout.',
            type: 'USER',
            required: true
        },
        {
            name: 'time',
            description: 'The time to timeout the user for.',
            type: 'STRING',
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the timeout.',
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
        const user = interaction.options.getMember('user');
        const time = interaction.options.getString('time');
        const reason = interaction.options.getString('reason') || 'No reason provided.';
        const msTime = ms(time);

        if (!interaction.guild.me.permissions.has("MODERATE_MEMBERS")) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("I don't have permissions to timeout members.").setColor("RED")], ephemeral: true});
        }

        if (user.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("You don't have perms for `timeout` this user").setColor("RED")], ephemeral: true});
        }

        if (user.id === interaction.user.id) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("You can't timeout yourself!").setColor("RED")], ephemeral: true});
        }

        if (!msTime) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription('Please, provide a valid time.\n' + "Example: `1d`, `1h`, `1m`, `1s`.").setColor("RED")], ephemeral: true});
        }

        try {
            await user.timeout(msTime, `${reason} + ${interaction.user.tag}`)
            interaction.reply({content: `${user.user.tag} has been timed out for ${time} for the following reason: ${reason}`, ephemeral: true});
        } catch (error) {
            console.error(error);
            interaction.reply({content: "An error occurred.\n`" + error  + "`", ephemeral: true});
        }
    },
};