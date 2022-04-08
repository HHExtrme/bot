const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "serverinfo",
    permission: "SERVERINFO",
    description: "Get information about the server.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const server = interaction.guild
        let miembros = server.memberCount
        let bots = server.members.cache.filter((m) => m.user.bot).size

        const verif = {
            NONE: "Ningúno",
            LOW: "Bajo",
            MEDIUM: "Medio",
            HIGH: "Alto",
            VERY_HIGH: "Muy Alto",
          };

        const embed = new MessageEmbed()
            .setAuthor({name: server.name.toString()})
            .setThumbnail(server.iconURL({ dynamic: true }))
            .setColor("AQUA")
            .setFooter(`Requested by ${interaction.user.username}`, interaction.user.displayAvatarURL())
            .setTimestamp()
            .addField("**🆔 | ID:**", server.id)
            .addField("**🔒 | Verification Level:**", `${verif[server.verificationLevel]}`)
            .addField("**👑 | Owner:**", `<@!${server.members.cache.get(server.ownerId).user.id}>`)
            .addField("**🔰 | Members:**", `${miembros} members`.replace("members", ""))
            .addField("**🤖 | Bots:**",  `${bots} bots`.replace("bots", ""))
            .addField("**📆 | Creation Date:**",`<t:${(server.createdTimestamp / 1000).toFixed(0)}:R>`)
            .addField("**🎨 | Roles:**", `${server.roles.cache.size}`)
            .addField("**🌂 | Emojis:**", `${server.emojis.cache.size}`)
        interaction.reply({embeds: [embed], ephemeral: false})
    }
}