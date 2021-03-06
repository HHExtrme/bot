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
            NONE: "NingΓΊno",
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
            .addField("**π | ID:**", server.id)
            .addField("**π | Verification Level:**", `${verif[server.verificationLevel]}`)
            .addField("**π | Owner:**", `<@!${server.members.cache.get(server.ownerId).user.id}>`)
            .addField("**π° | Members:**", `${miembros} members`.replace("members", ""))
            .addField("**π€ | Bots:**",  `${bots} bots`.replace("bots", ""))
            .addField("**π | Creation Date:**",`<t:${(server.createdTimestamp / 1000).toFixed(0)}:R>`)
            .addField("**π¨ | Roles:**", `${server.roles.cache.size}`)
            .addField("**π | Emojis:**", `${server.emojis.cache.size}`)
        interaction.reply({embeds: [embed], ephemeral: false})
    }
}