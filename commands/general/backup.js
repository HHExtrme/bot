const { 
    Client, 
    Message, 
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require("discord.js");

module.exports = {
    name: "backup",
    permission: "BACKUP",
    description: "Backup system",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const [SubCommand] = args;
        if (!SubCommand) {
            const embed = new MessageEmbed()
                .setTitle("Backup Commands")
                .setDescription("This is the list of commands for the backup system")
                .addField("**SubCommands:**", "`create` - Create a backup\n`load` - Load a backup\n`delete` - Delete a backup\n`list` - List all backups")
                .setColor("AQUA")
                .setFooter("Request by: " + message.author.tag, message.author.avatarURL());
            return message.channel.send({ embeds: [embed] });
        }
        if (SubCommand == "create") {
            try {
                const backup = require("discord-backup");
                const a = await message.reply({embeds: [new MessageEmbed().setColor("ORANGE").setDescription("Creating backup...")]});
                await backup.create(message.guild, {
                    jsonBeautify: true,
                }).then(async (backupData) => {
                    await a.edit({embeds: [new MessageEmbed().setColor("GREEN").setDescription(`Backup created correctly\n use /backup_load ${backupData.id}`)]});
                })
            } catch (err) {
                console.log(err);
                a.edit({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
            }
        } else if (SubCommand == "list") {
            try {
                const backup = require("discord-backup")
                const list = await backup.list();
                if (list.length === 0) {
                    return message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription("There are no backups available.")]});
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
                message.reply({embeds: [embed]});
            } catch (err) {
                message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
            }
        } else if (SubCommand == "load") {
            const backupID = args[1];
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
                const a = await message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Please, use the button below to confirm the backup loading")], components: [row]});
                const collector = a.createMessageComponentCollector({ filter: (i) => i.user.id === message.author.id && i.customId, time: 300000 })
                collector.on("collect", async (m) => {
                    if (m.customId === "LOAD-BACK") {
                        await backup.load(backupID, message.guild).then(() => {
                            return a.edit({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Backup loaded correctly")]});
                        }).catch((err) => {
                            if (err === 'No backup found') {
                                return a.edit({embeds: [new MessageEmbed().setColor("RED").setDescription("No backup found")]});
                            }
                        });
                    } else if (m.customId === "CANCEL-BACK") {
                        a.edit({embeds: [new MessageEmbed().setColor("RED").setDescription("Backup loading cancelled")], components: []});
                    }
                    collector.stop();
                }
            )})
        } catch (err) {
            message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        }
        } else if (SubCommand == "delete") {
            const backupID = args[1];
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
                const a = await message.reply({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Please, use the button below to confirm the backup remove")], components: [row]});
                const collector = a.createMessageComponentCollector({ filter: (i) => i.user.id === message.author.id && i.customId, time: 300000 })
                collector.on("collect", async (m) => {
                    if (m.customId === "REMOVE-BACK") {
                        await backup.remove(backupID).then(() => {
                            return a.edit({embeds: [new MessageEmbed().setColor("GREEN").setDescription("Backup removed correctly")], components: []});
                        }).catch((err) => {
                            if (err === 'No backup found') {
                                return a.edit({embeds: [new MessageEmbed().setColor("RED").setDescription("No backup found")], components: []});
                            }
                        });
                    } else if (m.customId === "CANCEL-BACK") {
                        a.edit({embeds: [new MessageEmbed().setColor("RED").setDescription("Backup remove cancelled")], components: []});
                    }
                    collector.stop();
                }
            )}) 
        } catch (err) {
            message.reply({embeds: [new MessageEmbed().setColor("RED").setDescription(`An error has occurred, please check and try again.\n\`${err}\``)]});
        }
        }
    },
};