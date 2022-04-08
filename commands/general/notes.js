const { Client, Message, MessageEmbed, MessageReaction } = require('discord.js');

module.exports = {
    name: "notes",
    permission: "NOTES",
    aliases: ["note"],
    category: ["general"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const notesDatabase = client.database.notesDatabase;
        
        const subCommand = args[0];
        if (subCommand === "add") {
            const note = args.slice(1).join(" ");
            if (!note) {
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("You must provide a note to add!")
                ]});
            }
            const userData = await notesDatabase.findOne({
                guildID: message.guild.id,
                userID: message.author.id
            });
            if (!userData) {
                await notesDatabase.insertOne({
                    guildID: message.guild.id,
                    userID: message.author.id,
                    notes: [note]
                });
            } else {
                await notesDatabase.updateOne({
                    guildID: message.guild.id,
                    userID: message.author.id
                }, {
                    $push: {
                        notes: note
                    }
                });
            }
            return message.reply({embeds: [
                new MessageEmbed()
                    .setColor("GREEN")
                    .setTitle("Note added!")
                    .setDescription(`Your note has been added as note #${userData.notes.length + 1}`)
                    .setFooter(`Note #${userData.notes.length + 1}`)
            ]})
        } else if (subCommand === "remove") {
            const note = args[1]
            if (!note) {
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("You must provide a note to remove!")
                ]});
            }
            const userData = await notesDatabase.findOne({
                guildID: message.guild.id,
                userID: message.author.id
            });

            if (!userData) {
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("RED")
                        .setDescription("You don't have any notes to remove!")
                ]});
            } else {
                // the note id is the index of the note in the array + 1
                const noteId = parseInt(note) - 1;
                if (noteId < 0 || noteId >= userData.notes.length) {
                    return message.reply({embeds: [
                        new MessageEmbed()
                            .setColor("RED")
                            .setDescription("Invalid note id!")
                    ]});
                }
                await notesDatabase.updateOne({
                    guildID: message.guild.id,
                    userID: message.author.id
                }, {
                    $pull: {
                        notes: {
                            $in: [userData.notes[noteId]]
                        }
                    }
                });
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("GREEN")
                        .setTitle("Note removed!")
                        .setDescription(`Your note has been removed`)
                ]})
            }
        } else if (subCommand === "list") {
            const userData = await notesDatabase.findOne({
                guildID: message.guild.id,
                userID: message.author.id
            });
            if (!userData || !userData.notes.length > 0) {
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription("You don't have any notes.")
                ]});
            } else {
                const notesMap = userData.notes.map((note, index) => {
                    return `\`${index + 1}.\` ${note}`;
                });

                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("#00ff00")
                        .setTitle("Your notes")
                        .setDescription(notesMap.join("\n"))
                ]});
            }
        } else if (subCommand === "clear") {
            const userData = await notesDatabase.findOne({
                guildID: message.guild.id,
                userID: message.author.id
            });
            if (!userData || !userData.notes.length > 0) {
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("#ff0000")
                        .setDescription("You don't have any notes.")
                ]});
            } else {
                await notesDatabase.updateOne({
                    guildID: message.guild.id,
                    userID: message.author.id
                }, {
                    $set: {
                        notes: []
                    }
                });
                return message.reply({embeds: [
                    new MessageEmbed()
                        .setColor("#00ff00")
                        .setDescription("Your notes have been cleared.")
                ]});
            }
        } else {
            return message.reply({embeds: [
                new MessageEmbed()
                    .setColor("RED")
                    .setDescription("Invalid subcommand!\n\n`" + client.config.PREFIX + "notes add <note>` to add a note\n`" + client.config.PREFIX + "notes remove <note_id>` to remove a note\n`" + client.config.PREFIX + "notes list` to list your notes\n`" + client.config.PREFIX + "notes clear` to clear your notes.")
            ]});
        }
    },
};