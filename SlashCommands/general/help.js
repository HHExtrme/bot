const { 
    MessageEmbed,
    MessageActionRow,
    CommandInteraction,
    MessageSelectMenu,
    Client
} = require('discord.js');

module.exports = {
    name: "help",
    permission: "HELP",
    description: "Displays a list of commands.",
    /**
     * 
     * @param {Client} client 
     * @param {CommandInteraction} interaction 
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {

        let generalCommands = "avatar, backup, help, ping, poll, reload, roleinfo, serverinfo, stats, stealEmoji, stealSticker, suggestion, translate, troll, userinfo";
        let moderationCommands = "ban, bans, blacklist, clear, nuke, unban, unwarn, warn, warns";
        let funCommands = "bonk, calculator, compile, dick, dripping, hug, iq, kill, kiss, lick, movie, npm, rps, screenshot, ttt, ship";
        let musicCommands = "loop, now_playing, pause, play, resume, skip, stop, volume";
        let ticketCommands = "add, alert, blacklist, claim, close, delete, remove, rename, unblacklist";
        let economyCommands = "balance, deposit, give-money, leaderboard, remove-money, reset-money, withdraw, work";
        let giveawayCommands = "gend, gstart, gpause, gresume, gend";

        const row = new MessageActionRow().addComponents(
            new MessageSelectMenu()
                .setCustomId("HELP-1")
                .setMaxValues(1)
                .addOptions(
                    {
                        label: "General Commands",
                        emoji: "📚",
                        value: "general"
                    },
                    {
                        label: "Moderation Commands",
                        emoji: "🔨",
                        value: "moderation"
                    },
                    {
                        label: "Fun Commands",
                        emoji: "🎮",
                        value: "fun"
                    },
                    {
                        label: "Giveaway Commands",
                        emoji: "🎁",
                        value: "giveaway"
                    },
                    {
                        label: "Music Commands",
                        emoji: "🎵",
                        value: "music"
                    },
                    {
                        label: "Ticket Commands",
                        emoji: "📩",
                        value: "ticket"
                    },
                    {
                        label: "Economy Commands",
                        emoji: "💰",
                        value: "economy"
                    }
                )
        );
        const mainEmbed = new MessageEmbed()
            .setTitle("Help")
            .setDescription("Select a category to view a list of commands.")
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()
        const generalEmbed = new MessageEmbed()
            .setTitle("General Commands")
            .setDescription(`General commands are used to interact with the bot.\n${"```"}${generalCommands}${"```"}`)
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()
        const moderationEmbed = new MessageEmbed()
            .setTitle("Moderation Commands")
            .setDescription(`Moderation commands are used to interact with the bot.\n${"```"}${moderationCommands}${"```"}`)
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()
        const funEmbed = new MessageEmbed()
            .setTitle("Fun Commands")
            .setDescription(`Fun commands are used to interact with the bot.\n${"```"}${funCommands}${"```"}`)
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()
        const ticketEmbed = new MessageEmbed()
            .setTitle("Ticket Commands")
            .setDescription(`Ticket commands are used to interact with the bot.\n${"```"}${ticketCommands}${"```"}`)
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()
        const musicEmbed = new MessageEmbed()
            .setTitle("Music Commands")
            .setDescription(`Music commands are used to interact with the bot.\n${"```"}${musicCommands}${"```"}`)
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()
        const giveawayEmbed = new MessageEmbed()
            .setTitle("Giveaway Commands")  
            .setDescription(`Giveaway commands are used to interact with the bot.\n${"```"}${giveawayCommands}${"```"}`)
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()
        const economyEmbed = new MessageEmbed()
            .setTitle("Economy Commands")
            .setDescription(`Economy commands are used to interact with the bot.\n${"```"}${economyCommands}${"```"}`)
            .setColor("#0099ff")
            .setFooter("Request by: " + interaction.user.tag, interaction.user.displayAvatarURL())
            .setTimestamp()

        await interaction.reply({ components: [row], embeds: [mainEmbed] });
        const msg = await interaction.fetchReply();

        const collector = msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id && i.customId, time: 300000 })

        collector.on('collect', (ints, option) => {
            if (ints.values[0] == "general") {
                interaction.editReply({ embeds: [generalEmbed], components: [row] });
            } else if (ints.values[0] == "moderation") {
                interaction.editReply({ embeds: [moderationEmbed], components: [row] });
            } else if (ints.values[0] == "fun") {
                interaction.editReply({ embeds: [funEmbed], components: [row] });
            } else if (ints.values[0] == "ticket") {
                interaction.editReply({ embeds: [ticketEmbed], components: [row] });
            } else if (ints.values[0] == "music") {
                interaction.editReply({ embeds: [musicEmbed], components: [row] });
            } else if (ints.values[0] == "giveaway") {
                interaction.editReply({ embeds: [giveawayEmbed], components: [row] });
            } else if (ints.values[0] == "economy") {
                msg.edit({ embeds: [economyEmbed], components: [row] });
            } else {
                msg.edit({ embeds: [mainEmbed], components: [row] });
            }
        });

        collector.on('end', () => {
            interaction.editReply({ components: [], embeds: [new MessageEmbed().setDescription(":x: Timed out!")] });
        })
    }
}