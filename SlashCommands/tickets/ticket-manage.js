const { 
    Client, 
    CommandInteraction, 
    MessageEmbed, 
    MessageActionRow,
    MessageButton
} = require("discord.js");

module.exports = {
    name: "ticket-manage",
    permission: "TICKET_MANAGE",
    description: "Manage tickets.",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'setup',
            description: 'Setup ticket panel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'name',
                    description: 'The name of the ticket panel.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'emoji',
                    description: 'The emoji to use for the ticket panel.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'category',
                    description: 'The category to put the ticket panel in.',
                    type: 'CHANNEL',
                    channelTypes: ["GUILD_CATEGORY"],
                    required: true
                },
                {
                    name: 'custom-id',
                    description: 'The custom ID to use for the ticket panel.',
                    type: 'STRING',
                    required: true
                },
                {
                    name: 'role-1',
                    description: 'The role necessary to view the ticket panel.',
                    type: 'ROLE',
                    required: true
                },
                {
                    name: 'role-2',
                    description: 'The role necessary to view the ticket panel.',
                    type: 'ROLE',
                    required: false
                },
                {
                    name: 'role-3',
                    description: 'The role necessary to view the ticket panel.',
                    type: 'ROLE',
                    required: false
                }
            ],
        },
        {
            name: 'delete',
            description: 'Delete a ticket panel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'custom-id',
                    description: 'The custom ID of the ticket panel to delete.',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'List all ticket panels.',
            type: 'SUB_COMMAND'
        },
        {
            name: 'send',
            description: 'Send a ticket panel.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'channel',
                    description: 'The channel to send the ticket panel to.',
                    type: 'CHANNEL',
                    channelTypes: ["GUILD_TEXT"],
                    required: false
                }
            ]
        },
        {
            name: 'reset-counter',
            description: 'Reset the ticket panel counter.',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'new-value',
                    description: 'The new value for the ticket panel counter.',
                    type: 'INTEGER',
                    required: false
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
        const ticketPanelSchema = client.database.ticketPanelDatabase;

        const [SubCommand] = args;
        if (SubCommand == "setup") {
            const ticketName     = interaction.options.getString('name');
            const ticketEmoji    = interaction.options.getString('emoji');
            const ticketCategory = interaction.options.getChannel('category')?.id;
            const ticketCustomID = interaction.options.getString('custom-id');
            const ticketRole1    = interaction.options.getRole('role-1');
            const ticketRole2    = interaction.options.getRole('role-2') || null;
            const ticketRole3    = interaction.options.getRole('role-3') || null;
            const guildData      = await ticketPanelSchema.findOne({ guildID: interaction.guild.id });

            const newTicketPanel = {
                customID: ticketCustomID,
                ticketName,
                ticketEmoji,
                ticketCategory,
                ticketRoles: [ticketRole1.id, ticketRole2 ? ticketRole2.id : ticketRole1.id, ticketRole3 ? ticketRole3.id : ticketRole1.id],
            };

            const roles = newTicketPanel.ticketRoles.map(x => interaction.guild.roles.cache.get(x));
            const rolesUnique = roles.filter((v, i, a) => a.indexOf(v) === i);
            newTicketPanel.ticketRoles = rolesUnique.map(x => x?.id);
    
            if (guildData) {
                const ticketPanel = guildData.tickets.find((x) => x.customID == ticketCustomID);
                if (ticketPanel) return interaction.reply({embeds: [new MessageEmbed().setDescription(`Ticket panel with custom ID \`${ticketCustomID}\` already exists.`).setColor("RED")]});
                else guildData.tickets = [...guildData.tickets, newTicketPanel];
                await guildData.save();
            } else {
                await ticketPanelSchema.create({
                    guildID: interaction.guild.id,
                    tickets: [newTicketPanel],
                });
            }

            const embed = new MessageEmbed()
                .setTitle(`Ticket Panel Created`)
                .setDescription(`A ticket panel has been created.`)
                .addField("Custom ID", newTicketPanel.customID, true)
                .addField("Panel Name", newTicketPanel.ticketName, true)
                .addField("Panel Emoji", newTicketPanel.ticketEmoji, true)
                .addField("Panel Category", `<#${newTicketPanel.ticketCategory}>`, true)
                .addField("Panel Roles", newTicketPanel.ticketRoles.map(x => interaction.guild.roles.cache.get(x)).join("\n"), true)
                .setColor("GREEN");
            interaction.reply({embeds: [embed]});
        } else if (SubCommand == "delete") {
            const ticketCustomID = interaction.options.getString('custom-id');

            const guildData = await ticketPanelSchema.findOne({ guildID: interaction.guild.id });
            if (!guildData) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});
            const ticketPanel = guildData.tickets.find((x) => x.customID == ticketCustomID);
            if (!ticketPanel) return interaction.reply({embeds: [new MessageEmbed().setDescription(`No ticket panel exists with custom ID \`${ticketCustomID}\`.`).setColor("RED")]});

            guildData.tickets = guildData.tickets.filter((x) => x.customID != ticketCustomID);
            await guildData.save();

            const embed = new MessageEmbed()
                .setTitle(`Ticket Panel Deleted`)
                .setDescription(`A ticket panel has been deleted.`)
                .addField("Custom ID", `${ticketPanel.customID}`, true)
                .addField("Panel Name", ticketPanel.ticketName, true)
                .addField("Panel Emoji", ticketPanel.ticketEmoji, true)
                .addField("Panel Category", `<#${ticketPanel.ticketCategory}>`, true)
                .addField("Panel Roles", ticketPanel.ticketRoles.map(x => interaction.guild.roles.cache.get(x)).join("\n"), true)
                .setColor("RED");
            interaction.reply({embeds: [embed]});
        } else if (SubCommand == "list") {
            const guildData = await ticketPanelSchema.findOne({ guildID: interaction.guild.id });
            if (!guildData) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});
            if (!guildData.tickets) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});
            if (guildData.tickets?.length == 0) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});

            const data = [];
            const options = guildData.tickets.map(x => {
                return {
                    customID: x.customID,
                    ticketName: x.ticketName,
                    ticketEmoji: x.ticketEmoji,
                    ticketCategory: x.ticketCategory,
                    ticketRoles: x.ticketRoles,
                }
            });
            
            for (let i = 0; i < options.length; i++) {
                data.push(`**Custom ID:** ${options[i].customID}`);
                data.push(`**Panel Name:** ${options[i].ticketName}`);
                data.push(`**Panel Emoji:** ${options[i].ticketEmoji}`);
                data.push(`**Panel Category:** <#${options[i].ticketCategory}>`);
                data.push(`**Panel Roles:** ${options[i].ticketRoles.map(x => interaction.guild.roles.cache.get(x)).join(",")}` + "\n");
            };

            const embed = new MessageEmbed()
                .setTitle(`Ticket Panel List`)
                .setDescription(`${data.join("\n")}`)
                .setThumbnail(interaction.guild.iconURL())
                .setColor("AQUA");
            interaction.reply({embeds: [embed]});
        } else if (SubCommand == "send") {
            const guildData = await ticketPanelSchema.findOne({ guildID: interaction.guild.id });
            if (!guildData) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});
            if (!guildData.tickets) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});
            if (guildData.tickets?.length == 0) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});

            const channel = interaction.options.getChannel('channel') || interaction.channel;

            const components = [];
            lastComponents = new MessageActionRow();
            const options = guildData.tickets.map(x => {
                return {
                    customID:  x.customID,
                    emoji:  x.ticketEmoji,
                    name: x.ticketName,
                }
            });

            for (let i = 0; i < options.length; i++) {
                if (options[i].emoji != undefined) {
                    const button = new MessageButton()
                        .setCustomId(options[i].customID)
                        .setEmoji(options[i].emoji)
                        .setStyle("SECONDARY")
                    lastComponents.addComponents(button)
                    if (lastComponents.components.length === 5) {
                        components.push(lastComponents)
                        lastComponents = new MessageActionRow();
                    }
                }
            }
            if (lastComponents.components.length > 0) {components.push(lastComponents)}
            const panels = `${options.map(x => `${x.emoji} » ${x.name}`).join('\n')}`;
            const messagePanel = client.messages.TICKETS.MESSAGE_EMBED;
            const message = messagePanel.replace(/{panels}/g, panels);

            channel.send({embeds: [new MessageEmbed()
                .setTitle("Support System | Create Ticket")
                .setDescription(message)
                .setColor("AQUA")
            ], components: components}).then(() => {
                interaction.reply({embeds: [
                    new MessageEmbed()
                        .setTitle("Support System | Create Ticket")
                        .setDescription(`A ticket panel has been sent to ${channel}.`)
                        .setColor("AQUA")
                ], ephemeral: true});
            })

        } else if (SubCommand == "reset-counter") {
            const numberOption = interaction.options.getInteger('new-value');
            const guildData = await ticketPanelSchema.findOne({ guildID: interaction.guild.id });
            if (!guildData) return interaction.reply({embeds: [new MessageEmbed().setDescription(`This guild does not have a ticket panel.`).setColor("RED")]});
            guildData.ticketCounter = numberOption || 0;
            await guildData.save();

            interaction.reply({embeds: [
                new MessageEmbed()
                    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.avatarURL({dynamic: true})})
                    .setDescription(`Ticket counter has been reset.`)
                    .setColor("GREEN")
            ]});
        }
    },
};