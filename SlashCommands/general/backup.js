const { 
    Client, 
    CommandInteraction, 
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");

module.exports = {
    name: "backup",
    permission: "BACKUP",
    description: "Backup system",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "create",
            type: 'SUB_COMMAND',
            description: "Create a backup",
        },
        {
            name: "list",
            type: 'SUB_COMMAND',
            description: "List backups",
        },
        {
            name: "load",
            type: 'SUB_COMMAND',
            description: "Load a backup",
            options: [
                {
                    name: "backup-id",
                    description: "id of the backup",
                    type: "STRING",
                    required: true
                }
            ],
        },
        {
            name: "delete",
            type: 'SUB_COMMAND',
            description: "Delete a backup",
            options: [
                {
                    name: "backup-id",
                    description: "id of the backup",
                    type: "STRING",
                    required: true
                },
            ],
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const [SubCommand] = args;
        if (SubCommand == "create") {
            try {
                const backup = require("discord-backup");
                await interaction.reply({embeds: [new MessageEmbed().setColor("ORANGE").setDescription("Creating backup...")]});
                await backup.create(interaction.guild, {
                    jsonBeautify: true,
                }).then(async (backupData) => {
                    await interaction.editReply({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`Backup created correctly\n use /backup_load ${backupData.id}`)]});
                })
            } catch (err) {
                console.log(err);
                interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
            }
        } else if (SubCommand == "list") {
            try {
                const backup = require("discord-backup")
                const list = await backup.list();
                if (list.length === 0) {
                    return interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("There are no backups available.")]});
                }
                const data = [];
                for (let i = 0; list.length > i; i++) {
                    const dick = await backup.fetch(list[i]);
                    data.push(`**ID:** ${(await dick).id}`);
                    data.push(`**Name:** ${(await dick).data.name}`);
                    data.push(`**Size:** ${(await dick).size}kb\n`);
                };
                const embed = new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Backup List")
                    .setDescription(data.join("\n"));
                interaction.reply({embeds: [embed]});
            } catch (err) {
                interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
            }
        } else if (SubCommand == "load") {
            const backupID = interaction.options.getString("backup-id");
            try {
            const backup = require("discord-backup")
            await backup.fetch(backupID).then(async () => {
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("Load")
                        .setStyle("PRIMARY")
                        .setCustomId("LOAD-BACK"),
                    new MessageButton()
                        .setLabel("Cancel")
                        .setStyle("DANGER")
                        .setCustomId("CANCEL-BACK")
                )
                interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Please, use the button below to confirm the backup loading")], components: [row]});
                const msg = await interaction.fetchReply();
                const collector = msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id && i.customId, time: 300000 })
                collector.on("collect", async (m) => {
                    if (m.customId === "LOAD-BACK") {
                        await backup.load(backupID, interaction.guild).then(() => {
                            return interaction.editReply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Backup loaded correctly")]});
                        }).catch((err) => {
                            if (err === 'No backup found') {
                                return interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription("No backup found")]});
                            }
                        });
                    } else if (m.customId === "CANCEL-BACK") {
                        interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription("Backup loading cancelled")], components: []});
                    }
                    collector.stop();
                }
            )})
        } catch (err) {
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        }
        } else if (SubCommand == "delete") {
            const backupID = interaction.options.getString("backup-id");
            try {
            const backup = require("discord-backup")
            await backup.fetch(backupID).then(async () => {
                const row = new MessageActionRow().addComponents(
                    new MessageButton()
                        .setLabel("Remove")
                        .setStyle("PRIMARY")
                        .setCustomId("REMOVE-BACK"),
                    new MessageButton()
                        .setLabel("Cancel")
                        .setStyle("DANGER")
                        .setCustomId("CANCEL-BACK")
                )
                interaction.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Please, use the button below to confirm the backup remove")], components: [row]});
                const msg = await interaction.fetchReply();
                const collector = msg.createMessageComponentCollector({ filter: (i) => i.user.id === interaction.user.id && i.customId, time: 300000 })
                collector.on("collect", async (m) => {
                    if (m.customId === "REMOVE-BACK") {
                        await backup.remove(backupID).then(() => {
                            return interaction.editReply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Backup removed correctly")], components: []});
                        }).catch((err) => {
                            if (err === 'No backup found') {
                                return interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription("No backup found")], components: []});
                            }
                        });
                    } else if (m.customId === "CANCEL-BACK") {
                        interaction.editReply({embeds: [new MessageEmbed().setColor("RED").setDescription("Backup remove cancelled")], components: []});
                    }
                    collector.stop();
                }
            )}) 
        } catch (err) {
            interaction.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        }
        }
    },
};