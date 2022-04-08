const { 
    Client, 
    CommandInteraction, 
    MessageEmbed, 
    MessageButton, 
    MessageActionRow 
} = require("discord.js");

module.exports = {
    name: "ticket",
    permission: "TICKET_OPTIONS",
    description: "Manage tickets",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "add",
            description: "Add a user to a ticket",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "user",
                    description: "The user to add to the ticket",
                    type: 'USER',
                    required: true
                }
            ],
        },
        {
            name: "remove",
            description: "Remove a user from a ticket",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "user",
                    description: "The user to remove from the ticket",
                    type: 'USER',
                    required: true
                }
            ]
        },
        {
            name: "close",
            description: "Close a ticket",
            type: 'SUB_COMMAND'
        },
        {
            name: "claim",
            description: "Claim a ticket",
            type: 'SUB_COMMAND'
        },
        {
            name: "open",
            description: "Open a ticket",
            type: 'SUB_COMMAND'
        },
        {
            name: "giveto",
            description: "Give a ticket to a user",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "user",
                    description: "The user to give the ticket to",
                    type: 'USER',
                    required: true
                }
            ]
        },
        {
            name: "alert",
            description: "Alert a user to a ticket",
            type: 'SUB_COMMAND',
            options: [
                {
                    name: "user",
                    description: "The user to alert",
                    type: 'USER',
                    required: false
                }
            ]
        },
        {
            name: "blacklist",
            description: "Blacklist a user from using tickets",
            type: 'SUB_COMMAND_GROUP',
            options: [
                {
                    name: "add",
                    description: "Add a user to the blacklist",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: "user",
                            description: "The user to blacklist",
                            type: 'USER',
                            required: true
                        }
                    ]
                },
                {
                    name: "remove",
                    description: "Remove a user from the blacklist",
                    type: 'SUB_COMMAND',
                    options: [
                        {
                            name: "user",
                            description: "The user to remove from the blacklist",
                            type: 'USER',
                            required: true
                        }
                    ]
                },
                {
                    name: "list",
                    description: "List all users on the blacklist",
                    type: 'SUB_COMMAND'
                }
            ]
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const ticketSchema = client.database.ticketDatabase;
        const panelSchema = client.database.ticketPanelDatabase;
        const SubGroup = interaction.options.getSubcommandGroup(false);
        const SubCommand = interaction.options.getSubcommand(false);

        if (SubGroup === "blacklist") {
            if (SubCommand === "add") {
                const user = interaction.options.getMember("user");
                if (!user) {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                            .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                            .setDescription("Please mention a user to blacklist.")
                            .setColor("RED")
                    ]});
                }
                const panelData = await panelSchema.findOne({guildID: interaction.guild.id});
                if (!panelData) {
                    new panelSchema({
                        guildID: interaction.guild.id,
                        usersBlacklisted: [user.id]
                    }).save()
                } else {
                    panelData.usersBlacklisted.push(user.id);
                    panelData.save();
                }
                return interaction.reply({embeds: [
                    new MessageEmbed()
                        .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                        .setDescription(`${user} has been blacklisted from using tickets.`)
                        .setColor("GREEN")
                ]});
            } else if (SubCommand === "remove") {
                const user = interaction.options.getMember("user");
                if (!user) {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                            .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                            .setDescription("Please mention a user to remove from the blacklist.")
                            .setColor("RED")
                    ]});
                }
                const panelData = await panelSchema.findOne({guildID: interaction.guild.id});
                if (!panelData) {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                            .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                            .setDescription("There are no users on the blacklist.")
                            .setColor("RED")
                    ]});
                }
                const index = panelData.usersBlacklisted.indexOf(user.id);
                if (index === -1) {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                            .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                            .setDescription("That user is not on the blacklist.")
                            .setColor("RED")
                    ]});
                }
                panelData.usersBlacklisted.splice(index, 1);
                panelData.save();
                return interaction.reply({embeds: [
                    new MessageEmbed()
                        .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                        .setDescription(`${user} has been removed from the blacklist.`)
                        .setColor("GREEN")
                ]});
            } else if (SubCommand === "list") {
                const panelData = await panelSchema.findOne({guildID: interaction.guild.id});
                if (!panelData?.usersBlacklisted?.length) {
                    return interaction.reply({embeds: [
                        new MessageEmbed()
                            .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                            .setDescription("There are no users on the blacklist.")
                            .setColor("RED")
                    ]});
                }
                const users = panelData.usersBlacklisted.map((id, index) => {
                    const user = interaction.guild.members.cache.get(id);
                    return `${index + 1}: ${user ? user.user.tag : "Unknown User"} (${user ? user.user.id : id})`;
                });
                return interaction.reply({embeds: [
                    new MessageEmbed()
                        .setAuthor({name: client.config.TICKET.SERVER_NAME + " | Ticket System", iconURL: client.user.displayAvatarURL()})
                        .addField("Blacklisted Users:", "```yaml\n" + users.join("\n") + "```")
                        .setColor("GREEN")
                ]});
            }
        }

        // Check if the channel is a ticket
        const ticket = await ticketSchema.findOne({ guildID: interaction.guild.id, channelID: interaction.channel.id });
        if (!ticket) return interaction.reply({embeds: [new MessageEmbed().setDescription("This channel is not a ticket channel.").setColor("RED")]});

        if (SubCommand == "add") {
            const user = interaction.options.getMember("user");
            await interaction.channel.permissionOverwrites.edit(user.id, {
                ATTACH_FILES: true,
                READ_MESSAGE_HISTORY: true,
                SEND_MESSAGES: true,
                VIEW_CHANNEL: true
            });

            await ticket.usersInTicket.push(user.id);
            await ticket.save();

            const embed = new MessageEmbed()
                .setTitle("Support System ✅")
                .setDescription(`${user} has been added to the ticket.`)
                .setColor("GREEN");
            interaction.reply({embeds: [embed]});
        } else if (SubCommand === "remove") {
            const user = interaction.options.getMember("user");
            await interaction.channel.permissionOverwrites.delete(user.id);

            await ticket.usersInTicket.pull(user.id);
            await ticket.save();

            interaction.reply({embeds: [new MessageEmbed()
                .setTitle("Support System ✅")
                .setDescription(`${user} has been removed from the ticket.`)
                .setColor("RED")
            ]});
        } else if (SubCommand === "close") {
            if (ticket.isClosed) return interaction.reply({embeds: [new MessageEmbed().setDescription("This ticket is already closed.").setColor("RED")]});

            const embed = new MessageEmbed()
                .setDescription("```Support team ticket controls```")
                .setColor("#2f3136")
            const userCloseEmbed = new MessageEmbed()
                .setDescription(`${interaction.member} has closed the ticket.`)
                .setColor("ORANGE");
            const row = new MessageActionRow().addComponents(
                new MessageButton().setLabel("Transcript").setStyle("SECONDARY").setEmoji("📑").setCustomId("T-TRN"),
                new MessageButton().setLabel("Open").setStyle("SECONDARY").setEmoji("🔓").setCustomId("T-OPEN"),
                new MessageButton().setLabel("Delete").setStyle("SECONDARY").setEmoji("⛔").setCustomId("T-DEL")
            );

            interaction.reply({embeds: [userCloseEmbed, embed], components: [row]}).then(() => {
                interaction.fetchReply().then((msg) => {
                    ticket.messageControl = msg.id;
                    ticket.isClosed = true; 
                    ticket.save();
                });
            });

            for (const user of ticket.usersInTicket) {
                await interaction.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
            };

            const pinnedMessage = (await interaction.channel.messages.fetchPinned())?.first();
            await pinnedMessage.edit({
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton().setStyle("SECONDARY").setLabel("Close").setEmoji("🔒").setCustomId("T-OPN-CLOSE").setDisabled(true),
                        new MessageButton().setStyle("SECONDARY").setLabel("Claim").setEmoji("👋").setCustomId("T-OPN-CLAIM").setDisabled(ticket.isClaimed)
                    )
                ]
            });
        } else if (SubCommand === "claim") {
            if (ticket.isClaimed) return interaction.reply({embeds: [new MessageEmbed().setDescription("This ticket is already claimed.").setColor("RED")]});

            const staffRoles = ticket.staffRoles;
            staffRoles.forEach(x => {
                const role = interaction.guild.roles.cache.get(x);
                interaction.channel.permissionOverwrites.edit(role.id, { VIEW_CHANNEL: false });
            });

            interaction.channel.permissionOverwrites.edit(interaction.member.id, { VIEW_CHANNEL: true, MANAGE_CHANNELS: true });
        
            interaction.reply({ embeds: [new MessageEmbed()
                .setDescription(`Ticket claimed by ${interaction.member}`)
                .setColor("YELLOW")
            ] }).then(() => {
                ticket.isClaimed = true;
                ticket.staffClaimed = interaction.member.id;
                ticket.save();
            });
        } else if (SubCommand === "giveto") {
            const user = interaction.options.getMember("user");
            if (!ticket.isClaimed) return interaction.reply({embeds: [new MessageEmbed().setDescription("This ticket is not claimed.").setColor("RED")]});
            if (ticket.staffClaimed != interaction.member.id) return interaction.reply({embeds: [new MessageEmbed().setDescription("You are not the owner of this ticket.").setColor("RED")]});

            await interaction.channel.permissionOverwrites.edit(user.id, { VIEW_CHANNEL: true, MANAGE_CHANNELS: true });

            interaction.reply({ embeds: [new MessageEmbed()
                .setDescription(`Ticket given to ${user}`)
                .setColor("YELLOW")
            ] }).then(() => {
                ticket.isClaimed = true;
                ticket.staffClaimed = user.id;
                ticket.save();
            });
        } else if (SubCommand === "alert") {
            const ticketOwner = interaction.options.getMember("user") || interaction.guild.members.cache.get(ticket.ownerID);
                
            try {
                await ticketOwner.send({embeds: [new MessageEmbed()
                    .setAuthor({name: "Ticket Alert", iconURL: interaction.guild.iconURL()})
                    .setDescription(`Hey <@!${ticketOwner.id}>! You have a ticket opened, please answer it!`)
                    .setColor("RED")
                ]});
            } catch (error) {
                return interaction.reply({embeds: [new MessageEmbed()
                    .setAuthor({name: "Ticket Alert", iconURL: interaction.guild.iconURL()})
                    .setDescription(`The user no have a DM open.`)
                    .setColor("RED")
                ], ephemeral: false});
            }
            return interaction.reply({embeds: [new MessageEmbed()
                .setAuthor({name: "Ticket Alert", iconURL: interaction.guild.iconURL()})
                .setDescription(`The user has been alerted.`)
                .setColor("GREEN")
            ], ephemeral: false});
        } else if (SubCommand === "open") {
            if (!ticket.isClosed) return interaction.reply({embeds: [new MessageEmbed().setDescription("This ticket is already open!").setColor("RED")], ephemeral: true});

            const embed = new MessageEmbed()
                .setDescription(`Ticket opened by ${interaction.member}`)
                .setColor("GREEN");
            for (const user of ticket.usersInTicket) {
                await interaction.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: true });
            };

            interaction.reply({ embeds: [embed] }).then(() => {
                ticket.isClosed = false;
                ticket.save();
            });
            
            const messagecontrol = await interaction.channel.messages.fetch(ticket.messageControl);
            if (messagecontrol) await messagecontrol.delete();

            const fetchPinned = await interaction.channel.messages.fetchPinned();
            if (fetchPinned) {
                fetchPinned.first().edit({
                    components: [
                        new MessageActionRow().addComponents(
                            new MessageButton().setStyle("SECONDARY").setLabel("Close").setEmoji("🔒").setCustomId("T-OPN-CLOSE").setDisabled(false),
                            new MessageButton().setStyle("SECONDARY").setLabel("Claim").setEmoji("👋").setCustomId("T-OPN-CLAIM").setDisabled(ticket.isClaimed)
                        )
                    ]
                });
            }
        }
    },
};