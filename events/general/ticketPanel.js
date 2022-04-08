const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const client = require('../../index');
const ticketPanelSchema = client.database.ticketPanelDatabase;
const ticketSchema = client.database.ticketDatabase;

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        const guildData = await ticketPanelSchema.findOne({guildID: interaction.guild.id,})
        if (!guildData || guildData.tickets?.length <= 0) return;
        let mapCustomID = guildData.tickets.map(x => x.customID);
        if (!mapCustomID.includes(interaction.customId)) return;

        const Data = guildData.tickets.find(x => x.customID === interaction.customId);
        const memberID = interaction.member.id;
        const ticketRoles = await Data.ticketRoles.map(x => {return {id: x,allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS", "MANAGE_MESSAGES"]}});
        await interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setDescription("Creating ticket...")], ephemeral: true})

        const userTickets = await ticketSchema.find({guildID: interaction.guild.id, ownerID: memberID});
        if (userTickets?.length >= client.config.TICKET.MAX_TICKETS) {
            return await interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription("You have reached the maximum number of tickets.")], ephemeral: true})
        }

        // check if the user is blacklisted
        const usersBlacklisted = await ticketPanelSchema.findOne({guildID: interaction.guild.id});
        if (usersBlacklisted.usersBlacklisted?.includes(memberID)) {
            return await interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription("You are blacklisted from using the ticket system.")], ephemeral: true})
        }

        const ticketNumber = await getNumber(guildData.ticketCounter, ticketPanelSchema, interaction.guild.id);
        await interaction.guild.channels.create(`ticket-${ticketNumber}`, {
            type: "text",
            parent: Data.ticketCategory,
            permissionOverwrites : [{id: interaction.guild.id,deny: ["VIEW_CHANNEL"]},{id: memberID,allow: ["VIEW_CHANNEL", "SEND_MESSAGES", "ADD_REACTIONS", "ATTACH_FILES", "EMBED_LINKS"]},...ticketRoles]
        }).then(async (channel) => {
            const row = new MessageActionRow().addComponents(
                new MessageButton().setStyle("SECONDARY").setLabel("Close").setEmoji("🔒").setCustomId("T-OPN-CLOSE"),
                new MessageButton().setStyle("SECONDARY").setLabel("Claim").setEmoji("👋").setCustomId("T-OPN-CLAIM"));
            const welcomeMessage = new MessageEmbed()
                .setTitle(`${client.config.TICKET.SERVER_NAME} | Support Center`)
                .setDescription(client.messages.TICKETS.TICKET_DESCRIPTION.replace('<member.username>', interaction.member.user.username).replace('<ticket.type>', Data.ticketName).replace('<member.mention>', interaction.member.user))
                .setColor("AQUA");

            await channel.send({
                content: `<@!${memberID}> | <@&${client.config.TICKET.STAFF_MENTION}>`,
                embeds: [welcomeMessage],
                components: [row]
            }).then((msg) => {
                msg.pin().then(() => {
                    channel.bulkDelete(1);
                });
            });

            const ticketSchemaData = new ticketSchema({
                guildID: interaction.guild.id,
                ownerID: memberID,
                channelName: channel.name,
                channelID: channel.id,
                ticketPanel: Data.ticketName,
                parentID: guildData.ticketCategory,
                dateCreated: Date.now(),
                isClosed: false,
                isClaimed: false,
                staffClaimed: "",
                staffRoles: ticketRoles.map(x => x?.id),
                usersInTicket: [memberID],
                messageControl: ""
            });
            await ticketSchemaData.save();

            interaction.editReply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`Ticket created <#${channel.id}>`)], ephemeral: true})
        });
    }
});

async function getNumber(ticketCounter, ticketSchema, guildID) {
    if (ticketCounter = 0) {
        await ticketSchema.findOneAndUpdate({guildID: guildID}, {$set: {ticketCounter: 1}})
    } else {
        await ticketSchema.findOneAndUpdate({guildID: guildID}, {$inc: {ticketCounter: 1}})
        let dataNum = await ticketSchema.findOne({guildID: guildID})
        const zeroPad = (num, places) => String(num).padStart(places, '0')
        var getNumber = zeroPad(dataNum.ticketCounter, 4);
    }
    return getNumber;
}
module.exports = getNumber;