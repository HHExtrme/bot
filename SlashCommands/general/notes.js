const { Client, CommandInteraction, MessageEmbed } = require("discord.js");

module.exports = {
    name: "notes",
    permission: "NOTES",
    description: "Saves notes for yourself",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'add',
            description: 'Adds a note',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'note',
                    description: 'The note to add',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'remove',
            description: 'Removes a note',
            type: 'SUB_COMMAND',
            options: [
                {
                    name: 'note_id',
                    description: 'The note to remove',
                    type: 'STRING',
                    required: true
                }
            ]
        },
        {
            name: 'list',
            description: 'Lists all notes',
            type: 'SUB_COMMAND'
        },
        {
            name: 'clear',
            description: 'Clears all notes',
            type: 'SUB_COMMAND'
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const notesDatabase = client.database.notesDatabase;

        const [subCommand] = args;
        await interaction.deferReply({ephemeral: true});
        if (subCommand === "add") {
            const note = interaction.options.getString('note');

            const userData = await notesDatabase.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            });
            if (!userData) {
                await notesDatabase.create({
                    guildID: interaction.guild.id,
                    userID: interaction.user.id,
                    notes: [note]
                });
            } else {
                await notesDatabase.updateOne({
                    guildID: interaction.guild.id,
                    userID: interaction.user.id
                }, {
                    $push: {
                        notes: note
                    }
                });
            }

            const noteId = userData.notes.length + 1;

            return interaction.followUp({embeds: [
                new MessageEmbed()
                    .setColor("#00ff00")
                    .setTitle("Note added!")
                    .setDescription(`Your note has been added as note #${noteId}`)
                    .setFooter(`Note #${noteId}`)
            ], ephemeral: true});
        } else if (subCommand === "remove") {
            const note = interaction.options.getString('note_id');

            const userData = await notesDatabase.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            });
            if (!userData) {
                return interaction.followUp({embeds: [
                    new MessageEmbed()
                        .setColor("#ff0000")
                        .setTitle("No notes found!")
                        .setDescription("You don't have any notes to remove")
                ], ephemeral: true});
            } else {
                // the note id is the index of the note in the array + 1
                const noteId = parseInt(note) - 1;
                if (noteId < 0 || noteId >= userData.notes.length) {
                    return interaction.followUp({embeds: [
                        new MessageEmbed()
                            .setColor("#ff0000")
                            .setTitle("Invalid note id!")
                            .setDescription("The note id you provided is invalid")
                    ], ephemeral: true});
                } else {
                    await notesDatabase.updateOne({
                        guildID: interaction.guild.id,
                        userID: interaction.user.id
                    }, {
                        $pull: {
                            notes: userData.notes[noteId]
                        }
                    });

                    return interaction.followUp({embeds: [
                        new MessageEmbed()
                            .setColor("#00ff00")
                            .setTitle("Note removed!")
                            .setDescription(`Your note has been removed`)
                            .setFooter(`Note #${note}`)
                    ]});
                }
            }
        } else if (subCommand === "list") {
            const userData = await notesDatabase.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            });
            if (!userData || !userData.notes.length > 0) {
                return interaction.followUp({embeds: [
                    new MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription("You don't have any notes.")
                ]});
            } else {
                const notesMap = userData.notes.map((note, index) => {
                    return `\`${index + 1}.\` ${note}`;
                });

                return interaction.followUp({embeds: [
                    new MessageEmbed()
                        .setColor("#00ff00")
                        .setTitle("Your notes")
                        .setDescription(notesMap.join("\n"))
                ]});

            }
        } else if (subCommand === "clear") {
            const userData = await notesDatabase.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            });
            if (!userData || !userData.notes.length > 0) {
                return interaction.followUp({embeds: [
                    new MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription("You don't have any notes.")
                ]});
            } else {
                await notesDatabase.updateOne({
                    guildID: interaction.guild.id,
                    userID: interaction.user.id
                }, {
                    $set: {
                        notes: []
                    }
                });

                return interaction.followUp({embeds: [
                    new MessageEmbed()
                        .setColor("#00ff00")
                        .setTitle("Notes cleared!")
                        .setDescription("Your notes have been cleared.")
                ]});
            }
        }
    },
};