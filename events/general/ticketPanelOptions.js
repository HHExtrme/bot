const { 
    MessageEmbed, 
    MessageActionRow, 
    MessageButton 
} = require("discord.js");
const client = require('../../index');
const discordTranscripts = require('discord-html-transcripts');
const ticketSchema = client.database.ticketDatabase;

client.on("interactionCreate", async (interaction) => {
    if (interaction.isButton()) {
        if (interaction.customId == "T-OPN-CLOSE") {
            await interaction.deferUpdate();
            const userData = await ticketSchema.findOne({ guildID: interaction.guild.id, channelID: interaction.channel.id });
            if (userData.isClosed) return interaction.followUp({embeds: [new MessageEmbed().setDescription("This ticket is already closed!").setColor("RED")], ephemeral: true});

            interaction.editReply({
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton().setStyle("SECONDARY").setLabel("Close").setEmoji("🔒").setCustomId("T-OPN-CLOSE").setDisabled(true),
                        new MessageButton().setStyle("SECONDARY").setLabel("Claim").setEmoji("👋").setCustomId("T-OPN-CLAIM").setDisabled(userData.isClaimed)
                    )
                ]
            });

            const embed = new MessageEmbed()
                .setDescription("```Support team ticket controls```")
                .setColor("#2f3136");
            const row = new MessageActionRow().addComponents(
                new MessageButton().setLabel("Transcript").setStyle("SECONDARY").setEmoji("📑").setCustomId("T-TRN"),
                new MessageButton().setLabel("Open").setStyle("SECONDARY").setEmoji("🔓").setCustomId("T-OPEN"),
                new MessageButton().setLabel("Delete").setStyle("SECONDARY").setEmoji("⛔").setCustomId("T-DEL")
            );

            for (const user of userData.usersInTicket) {
                await interaction.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: false });
            };

            const userCloseEmbed = new MessageEmbed()
                .setDescription(`${interaction.member} has closed the ticket.`)
                .setColor("ORANGE");

            interaction.channel.send({
                embeds: [userCloseEmbed, embed],
                components: [row]
            }).then((msg) => {
                userData.messageControl = msg.id;
                userData.isClosed = true;
                userData.save();
            });
        } else if (interaction.customId == "T-OPEN") {
            await interaction.deferUpdate();
            if (!client.utils.checkPermission(client, interaction, "TICKET_OPTIONS", "followUp")) return;
            const userData = await ticketSchema.findOne({ guildID: interaction.guild.id, channelID: interaction.channel.id });
            if (!userData.isClosed) return interaction.followUp({embeds: [new MessageEmbed().setDescription("This ticket is already open!").setColor("RED")], ephemeral: true});

            const embed = new MessageEmbed()
                .setDescription(`Ticket opened by ${interaction.member}`)
                .setColor("GREEN");
            for (const user of userData.usersInTicket) {
                await interaction.channel.permissionOverwrites.edit(user, { VIEW_CHANNEL: true });
            };
            interaction.channel.send({
                embeds: [embed]
            }).then(() => {
                interaction.message.delete();
                userData.isClosed = false;
                userData.save();
            });

            const pinnedMessage = (await interaction.channel.messages.fetchPinned())?.first();
            await pinnedMessage.edit({
                components: [
                    new MessageActionRow().addComponents(
                        new MessageButton().setStyle("SECONDARY").setLabel("Close").setEmoji("🔒").setCustomId("T-OPN-CLOSE").setDisabled(false),
                        new MessageButton().setStyle("SECONDARY").setLabel("Claim").setEmoji("👋").setCustomId("T-OPN-CLAIM").setDisabled(userData.isClaimed)
                    )
                ]
            });
        } else if (interaction.customId == "T-OPN-CLAIM") {
            await interaction.deferUpdate();
            if (!client.utils.checkPermission(client, interaction, "TICKET_OPTIONS", "followUp")) return;
            const userData = await ticketSchema.findOne({ guildID: interaction.guild.id, channelID: interaction.channel.id });
            if (userData.isClaimed) return interaction.followUp({embeds: [new MessageEmbed().setDescription("This ticket is already claimed!").setColor("RED")], ephemeral: true});

            const staffRoles = userData.staffRoles;
            staffRoles.forEach(x => {
                const role = interaction.guild.roles.cache.get(x);
                interaction.channel.permissionOverwrites.edit(role.id, { VIEW_CHANNEL: false });
            });
            
            interaction.channel.permissionOverwrites.edit(interaction.member.id, { VIEW_CHANNEL: true, MANAGE_CHANNELS: true });

            const embed = new MessageEmbed()
                .setDescription(`Ticket claimed by ${interaction.member}`)
                .setColor("YELLOW");
            const row = new MessageActionRow().addComponents(
                new MessageButton().setStyle("SECONDARY").setLabel("Close").setEmoji("🔒").setCustomId("T-OPN-CLOSE"),
                new MessageButton().setStyle("SECONDARY").setLabel("Claim").setEmoji("👋").setCustomId("T-OPN-CLAIM").setDisabled(true)
            );
            interaction.message.edit({ components: [row] });
            interaction.channel.send({ embeds: [embed] }).then(() => {
                userData.isClaimed = true;
                userData.staffClaimed = interaction.member.id;
                userData.save();
            });
        } else if (interaction.customId == "T-DEL") {
            await interaction.deferUpdate();
            if (!client.utils.checkPermission(client, interaction, "TICKET_OPTIONS", "followUp")) return;
            const userData = await ticketSchema.findOne({ guildID: interaction.guild.id, channelID: interaction.channel.id });
            if (!userData.isClosed) return interaction.followUp({embeds: [new MessageEmbed().setDescription("This ticket is not closed!").setColor("RED")], ephemeral: true});

            const embed = new MessageEmbed()
                .setDescription("This ticket will be deleted in 5 seconds")
                .setColor("RED");
            interaction.channel.send({ embeds: [embed] }).then(() => {
                setTimeout(async () => {
                    await interaction.channel.delete();
                    userData.delete();
                }, 5000);
            });
        } else if (interaction.customId == "T-TRN") {
            await interaction.deferUpdate();
            if (!client.utils.checkPermission(client, interaction, "TICKET_OPTIONS", "followUp")) return;
            const trow = new MessageActionRow().addComponents(new MessageButton().setCustomId("TR-YES").setLabel("Yes").setStyle("SUCCESS"),new MessageButton().setCustomId("TR-CN").setLabel("Cancel").setStyle("SECONDARY"),new MessageButton().setCustomId("TR-NO").setLabel("No").setStyle("DANGER"))
			interaction.channel.send({embeds: [new MessageEmbed().setDescription("Do you want to send the ticket to the user?").setColor("#2f3136")],components: [trow]})
        } else if (interaction.customId == "TR-YES") {
            await interaction.deferUpdate();
            if (!client.utils.checkPermission(client, interaction, "TICKET_OPTIONS", "followUp")) return;
            const userData = await ticketSchema.findOne({ guildID: interaction.guild.id, channelID: interaction.channel.id });

            interaction.message.delete();
			const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("ORANGE")
			let savingMessage = interaction.channel.send({embeds: [saving]})

            const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});
            const channel = interaction.guild.channels.cache.get(client.config.TICKET.TRANSCRIPT_CHANNEL)
            const member = interaction.guild.members.cache.get(userData.ownerID);

            const embed = new MessageEmbed()
                .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic: true})})
                .addField("Ticket Owner", `<@!${userData.ownerID}>`, true)
                .addField("Ticket Name", interaction.channel.name, true)
                .setColor("#2f3136");
            await channel.send({embeds: [embed], files: [file]}).then((msg) => {
                msg.edit({embeds: [embed.addField("Panel Name", `${userData.ticketPanel}`, true).addField("Direct Transcript", `[Direct Transcript](${msg.attachments.first().url})`, true).addField("Ticket Closed", interaction.user.tag, true)]});
            })

            const embed2 = new MessageEmbed()
                .setDescription(`Transcript sent to <#${channel.id}>`)
                .setColor("GREEN");
            (await savingMessage).edit({embeds: [embed2]})

            try {
                await member.send({embeds: [embed], files: [file]});
            } catch (error) {
                (await savingMessage).edit({embeds: [new MessageEmbed().setDescription("Failed to send transcript to user").setColor("RED")]})
            }
        } else if (interaction.customId == "TR-CN") {
            await interaction.deferUpdate();
            if (!client.utils.checkPermission(client, interaction, "TICKET_OPTIONS", "followUp")) return;
            interaction.message.delete();
        } else if (interaction.customId == "TR-NO") {
            await interaction.deferUpdate();
            if (!client.utils.checkPermission(client, interaction, "TICKET_OPTIONS", "followUp")) return;
            const userData = await ticketSchema.findOne({ guildID: interaction.guild.id, channelID: interaction.channel.id });

            interaction.message.delete();
            const saving = new MessageEmbed().setDescription(`Saving transcript...`).setColor("ORANGE")
            let savingMessage = interaction.channel.send({embeds: [saving]})

            const file = await discordTranscripts.createTranscript(interaction.channel, {limit: -1,returnBuffer: false,fileName: `transcript-${interaction.channel.name}.html`});
            const channel = interaction.guild.channels.cache.get(client.config.TICKET.TRANSCRIPT_CHANNEL)
            const member = interaction.guild.members.cache.get(userData.ownerID);

            const embed = new MessageEmbed()
                .setAuthor({name: member.user.tag, iconURL: member.user.displayAvatarURL({dynamic: true})})
                .addField("Ticket Owner", `<@!${userData.ownerID}>`, true)
                .addField("Ticket Name", interaction.channel.name, true)
                .setColor("#2f3136");
            await channel.send({embeds: [embed], files: [file]}).then((msg) => {
                msg.edit({embeds: [embed.addField("Panel Name", `${userData.ticketPanel}`, true).addField("Direct Transcript", `[Direct Transcript](${msg.attachments.first().url})`, true).addField("Ticket Closed", interaction.user.tag, true)]});
            })

            const embed2 = new MessageEmbed()
                .setDescription(`Transcript sent to <#${channel.id}>`)
                .setColor("GREEN");
            (await savingMessage).edit({embeds: [embed2]})
        }
    }
});