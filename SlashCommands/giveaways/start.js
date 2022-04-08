const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const ms = require("ms");
const yaml = require('js-yaml');
const fs = require('fs');
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', 'utf8', 2))

module.exports = {
    name: "gstart",
    permission: "GSTART",
    description: "start a giveaway",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "channel",
            description: "channel where the giveaway will be hosted",
            type: "CHANNEL",
            required: true
        },
        {
            name: "time",
            description: "time of the giveaway",
            type: "STRING",
            required: true
        },
        {
            name: "winners",
            description: "number of winners",
            type: "NUMBER",
            required: true
        },
        {
            name: "prize",
            description: "prize of the giveaway",
            type: "STRING",
            required: true
        },
        {
            name: "role",
            description: "The role that the user must have to be able to enter the draw",
            type: "ROLE",
            required: false
        },
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const channel = interaction.options.getChannel("channel");
        const time = interaction.options.getString("time");
        const winners = interaction.options.getNumber("winners");
        const prize = interaction.options.getString("prize");
        const role = interaction.options.getRole("role") || interaction.guild.roles.everyone;

        try {
            client.giveawaysManager.start(channel, {
                duration: ms(time),
                winnerCount: winners,
                prize: prize,
                hostedBy : client.config.GIVEAWAYS.HOSTED_BY ? interaction.user.tag : null,
                extraData : role.id ? role.id : null,
                exemptMembers: (member) => !interaction.member.roles.cache.some((r) => r.id === role.id),
                messages : {
                    giveaway: mensajes.GIVEAWAYS.GIVEAWAY,
                    giveawayEnded: mensajes.GIVEAWAYS.GIVEAWAY_ENDED,
                    winMessage: mensajes.GIVEAWAYS.WIN_MESSAGE.replace("{prize}", "{this.prize}"),
                    noWinner: mensajes.GIVEAWAYS.NO_WINNER,
                    drawing: mensajes.GIVEAWAYS.DURATION,
                    inviteToParticipate: mensajes.GIVEAWAYS.INVITE_TO_PARTICIPATE,
                    hostedBy: mensajes.GIVEAWAYS.HOSTED_BY.replace("{user}", "{this.hostedBy}"),
                }
            }).then(g => {})
            interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`Giveaway started in ${channel}`)], ephemeral: true});
        } catch (err) {
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        }
    },
};