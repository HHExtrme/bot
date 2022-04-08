const { 
    Client, 
    Message, 
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
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let role =  message.guild.roles.cache.get(args[3]);
        const channel = message.mentions.channels.first();
        const prize = args.slice(4).join(" ");
        const winners = args[2];
        const time = args[1];

        if (!channel) {
            return message.reply({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({dynamic: true})})
                    .setDescription("You must mention a channel to start the giveaway.\n\nExample: `"+ client.config.PREFIX +"gstart #giveaways <time> <winners> <role-id> <prize>`")
                    .setColor("RED")
            ]});
        }
        if (!time) {
            return message.reply({embeds: [
                new MessageEmbed()  
                    .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({dynamic: true})})
                    .setDescription("You must specify a time for the giveaway.\n\nExample: `"+ client.config.PREFIX +"gstart #giveaways <time> <winners> <role-id> <prize>`")
                    .setColor("RED")
            ]});
        }
        if (!winners) {
            return message.reply({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({dynamic: true})})
                    .setDescription("You must specify the number of winners for the giveaway.\n\nExample: `"+ client.config.PREFIX +"gstart #giveaways <time> <winners> <role-id> <prize>`")
                    .setColor("RED")
            ]});
        }
        if (args[3]?.toLowerCase() === "everyone") role = message.guild.roles.everyone;
        if (!role) {
            return message.reply({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({dynamic: true})})
                    .setDescription("You must specify a role or id for the giveaway.\n\nExample: `"+ client.config.PREFIX +"gstart #giveaways <time> <winners> <role-id> <prize>`")
                    .setColor("RED")
            ]});
        }
        if (!prize) {
            return message.reply({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.avatarURL({dynamic: true})})
                    .setDescription("You must specify a prize for the giveaway.\n\nExample: `"+ client.config.PREFIX +"gstart #giveaways <time> <winners> <role-id> <prize>`")
                    .setColor("RED")
            ]});
        }

        try {
            await client.giveawaysManager.start(channel, {
                duration: ms(time),
                winnerCount: parseInt(winners),
                prize: prize,
                hostedBy : client.config.GIVEAWAYS.HOSTED_BY ? message.author.tag : null,
                extraData : role.id,
                exemptMembers: (member) => !message.member.roles.cache.some((r) => r.id === role.id),
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
            await message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`Giveaway started in ${channel}`)], ephemeral: true});
        } catch (err) {
            message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        }
    },
};