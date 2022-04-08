const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "remove-timeout",
    permission: "REMOVE_TIMEOUT",
    description: "Removes a timeout from a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'user',
            description: 'The user to remove the timeout from.',
            type: 'USER',
            required: true
        },
        {
            name: 'reason',
            description: 'The reason for the timeout removal.',
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
        const reason = interaction.options.getString('reason');

        if (!interaction.guild.me.permissions.has("MODERATE_MEMBERS")) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("I don't have permissions to timeout members.").setColor("RED")], ephemeral: true});
        }
        if (user.id === interaction.user.id) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("You can't remove a timeout from yourself!").setColor("RED")], ephemeral: true});
        }
        if (user.roles.highest.position >= interaction.member.roles.highest.position) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("You don't have perms for `remove-timeout` this user").setColor("RED")], ephemeral: true});
        }
        if (user.id == client.user.id) {
            return interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("I can't be removed from a timeout!").setColor("RED")], ephemeral: true});
        }
        try {
            await user.timeout(null, `${reason} - ${interaction.user.tag}`)
            interaction.reply({content: `<@!${user.id}> has been removed from timeout for the following reason: ${reason}`, ephemeral: true});
        } catch (error) {
            console.error(error);
            interaction.reply({embeds: [new MessageEmbed().setTitle("An error ocurred!").setDescription("I couldn't remove the timeout from this user.").setColor("RED")], ephemeral: true});
        }
    },
};