const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    permission: "USER_INFO",
    description: "Get information about a user.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const Member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let flags = message.author.flags.toArray().join(``);

        if (!flags) {
            flags = "None";
          }
      
          flags = flags.replace(
            "HOUSE_BRAVERY",
            "• HypeSquad Bravery"
          );
          flags = flags.replace(
            "EARLY_SUPPORTER",
            "• Early Supporter"
          );
          flags = flags.replace(
            "VERIFIED_DEVELOPER",
            "• Verified Bot Developer"
          );
          flags = flags.replace(
            "EARLY_VERIFIED_DEVELOPER",
            "• Verified Bot Developer"
          );
          flags = flags.replace(
            "HOUSE_BRILLIANCE",
            "• HypeSquad Brilliance"
          );
          flags = flags.replace(
            "HOUSE_BALANCE",
            "• HypeSquad Balance"
          );
          flags = flags.replace(
            "DISCORD_PARTNER",
            "• Partner"
          );
          flags = flags.replace(
            "HYPESQUAD_EVENTS",
            "• Hypesquad Events"
          );
          flags = flags.replace(
            "DISCORD_CLASSIC",
            "• Discord Classic"
          );

        if (Member) {
            const devices = Member.presence?.clientStatus || {};
            const devices2 = () => {
                if (devices > 1) {
                    const entries = Object.entries(devices).map(
                        (value) => value[0]
                    );
                    return `»  Device: ${entries}`
                } else {
                    const entries = Object.entries(devices).map(
                        (value, index) => `${value[0]}`)
                        .join(", ")
                    return `»  Device: ${entries}`
                }
            }
            const respuesta = new MessageEmbed()
                .setAuthor({name: Member.user.username, iconURL: Member.user.displayAvatarURL({dynamic: true})})
                .setThumbnail(Member.user.displayAvatarURL({dynamic: true}))
                .setDescription(`**Account Information**\n»  User: ${Member.user.tag} (${Member.id})\n»  Account created: <t:${(Member.user.createdTimestamp / 1000).toFixed(0)}:D>\n ${devices2()}\n» Badge Information:\n ${flags}\n\n**Server Information**\n»  Member Since: <t:${(Member.joinedTimestamp / 1000).toFixed(0)}:D>\n»  Highest Role: <@&${Member.roles.highest.id}>\n»  Roles: ${Member.roles.cache.map(r => r).join(" ").replace("@everyone", " ")}`)
                .setColor("RANDOM")
                .setFooter(`Requested by ` + message.author.username + "", message.author.avatarURL()
            );
            return message.reply({embeds: [respuesta], ephemeral: false});
        }
    },
};