const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "userinfo",
    permission: "USERINFO",
    description: "Get information about a user.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'member',
            description: 'Get information about a single member.',
            type: 'USER',
            required: false
        },
        {
            name: 'user-id',
            description: 'Get information about a user using id.',
            type: 'STRING',
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
        const Member = interaction.options.getMember('member') || interaction.member;
        const userId = interaction.options.getString('user-id');
        let flags = interaction.user.flags.toArray().join(``);

        if (!flags) {
            flags = "None";
          }
      
          flags = flags.replace(
            "HOUSE_BRAVERY",
            "• <:discordhypesquard:919738399785623632> HypeSquad Bravery"
          );
          flags = flags.replace(
            "EARLY_SUPPORTER",
            "• <:earlysupporter:919738251449884672> Early Supporter"
          );
          flags = flags.replace(
            "VERIFIED_DEVELOPER",
            "• <:discordbotdev:919738200870764545>  Verified Bot Developer"
          );
          flags = flags.replace(
            "EARLY_VERIFIED_DEVELOPER",
            "• <:discordbotdev:919738200870764545> Verified Bot Developer"
          );
          flags = flags.replace(
            "HOUSE_BRILLIANCE",
            "• <:HSbrilliance:919738251575701605> HypeSquad Brilliance"
          );
          flags = flags.replace(
            "HOUSE_BALANCE",
            "• <:HSbalance:919738251596685362> HypeSquad Balance"
          );
          flags = flags.replace(
            "DISCORD_PARTNER",
            "• <:colorserverpartner:919738201046925393> Partner"
          );
          flags = flags.replace(
            "HYPESQUAD_EVENTS",
            "• <:eventcolour:919738251256934410> Hypesquad Events"
          );
          flags = flags.replace(
            "DISCORD_CLASSIC",
            "• <:discordnitro:919738399609479250> Discord Classic"
          );
        

        if (userId){
            const user = await interaction.guild.members.cache.get(userId);
            const devices = user.presence?.clientStatus || {};
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
                .setAuthor({name: user.user.username, iconURL: user.user.displayAvatarURL({dynamic: true})})
                .setThumbnail(user.user.displayAvatarURL({dynamic: true}))
                .setDescription(`**Account Information**\n»  User: ${user.user.tag} (${user.id})\n»  Account created: <t:${(user.user.createdTimestamp / 1000).toFixed(0)}:D>\n ${devices2()}\n**Badge Information:** ${flags}\n\n**Server Information**\n»  user Since: <t:${(user.joinedTimestamp / 1000).toFixed(0)}:D>\n»  Highest Role: <@&${user.roles.highest.id}>\n»  Roles: ${user.roles.cache.map(r => r).join(" ").replace("@everyone", " ")}`)
                .setColor("RANDOM")
                .setFooter(`Requested by ` + interaction.user.username + "", interaction.user.avatarURL()
            );
            return interaction.reply({embeds: [respuesta], ephemeral: false}); 
        }

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
                .setFooter(`Requested by ` + interaction.user.username + "", interaction.user.avatarURL()
            );
            return interaction.reply({embeds: [respuesta], ephemeral: false});
        }
    },
};