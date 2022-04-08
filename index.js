;+process.version.slice(1).split('.')[0] < 16 &&
(console.log('\x1B[31mAbsolet need Node JS 16 or higher..\x1B[0m'),
    process.exit())

// Variables

const mongoose = require('mongoose')
const yaml = require('js-yaml')
const fs = require('fs')

const { Client, Collection, MessageEmbed } = require('discord.js')
const { GiveawaysManager } = require('discord-giveaways')
const { Player } = require('discord-music-player')

const config = yaml.load(fs.readFileSync('config/config.yml', {encoding: 'utf8'}))
const commands = yaml.load(fs.readFileSync('config/commands.yml', {encoding: 'utf8'}))
const mensajes = yaml.load(fs.readFileSync('config/messages.yml', {encoding: 'utf8'}))

const client = new Client({
    intents: 32767,
    disableEveryone: true,
    disabledEvents: ['TYPING_START']
})

module.exports = client

// Databases

const banDatabase = mongoose.model('banSchema', new mongoose.Schema({
    guildID: String,
    memberID: String,
    bans: Array,
    moderator: Array,
    date: Array
}))

const blacklistDatabase = mongoose.model('blacklistSchema', new mongoose.Schema({
    guildID: String,
    memberID: Array
}))

const blacklistWordsDatabase = mongoose.model('blacklistWords', new mongoose.Schema({
    guildID: String,
    words: [String]
}))

const economyDatabase = mongoose.model('economy', new mongoose.Schema({
    guildID: String,
    userID: String,
    balance: {
        money: {
            type: Number,
            required: true,
            default: 0
        },
        bank: {
            type: Number,
            required: true,
            default: 0
        }
    }
}))

const giveawayDatabase = mongoose.model('giveaways', new mongoose.Schema({
        messageId: String,
        channelId: String,
        guildId: String,
        startAt: Number,
        endAt: Number,
        ended: Boolean,
        winnerCount: Number,
        prize: String,
        messages: {
            giveaway: String,
            giveawayEnded: String,
            inviteToParticipate: String,
            drawing: String,
            dropMessage: String,
            winMessage: mongoose.Mixed,
            embedFooter: mongoose.Mixed,
            noWinner: String,
            winners: String,
            endedAt: String,
            hostedBy: String,
        },
        thumbnail: String,
        hostedBy: String,
        winnerIds: {
            type: [String],
            default: undefined,
        },
        reaction: mongoose.Mixed,
        botsCanWin: Boolean,
        embedColor: mongoose.Mixed,
        embedColorEnd: mongoose.Mixed,
        exemptPermissions: {
            type: [],
            default: undefined,
        },
        exemptMembers: String,
        bonusEntries: String,
        extraData: mongoose.Mixed,
        lastChance: {
            enabled: Boolean,
            content: String,
            threshold: Number,
            embedColor: mongoose.Mixed,
        },
        pauseOptions: {
            isPaused: Boolean,
            content: String,
            unPauseAfter: Number,
            embedColor: mongoose.Mixed,
            durationAfterPause: Number,
        },
        isDrop: Boolean,
        allowedMentions: {
            parse: {
                type: [String],
                default: undefined,
            },
            users: {
                type: [String],
                default: undefined,
            }, 
            roles: {
                type: [String],
                default: undefined,
            },
        },
    },
    {
        id: false
    }
))

const reactionRolesDatabase = mongoose.model('reactionRoles', new mongoose.Schema({
    guildID: String,
    roles: Array
}))

const suggestDatabase = mongoose.model('suggestSchema', new mongoose.Schema({
    guild: String,
    message: String,
    token: String,
    suggestion: String,
    user: String,
}))

const warnDatabase = mongoose.model('WarnSchema', new mongoose.Schema({
    guildID: String,
    memberID: String,
    warnings: Array,
    moderator: Array,
    date: Array,
}))

const ticketDatabase = mongoose.model('ticketDatabase', new mongoose.Schema({
    guildID: String,
    ownerID: String,
    channelName: String,
    channelID: String,
    ticketPanel: String,
    parentID: String,
    dateCreated: Date,
    isClosed: Boolean,
    isClaimed: Boolean,
    staffClaimed: String,
    staffRoles: Array,
    usersInTicket: Array,
    messageControl: String,
}))

const ticketPanelDatabase = mongoose.model('ticketPanel', new mongoose.Schema({
    guildID: String,
    tickets: Array,
    usersBlacklisted: Array,
    ticketCounter: Number
}))

const notesDatabase = mongoose.model('notes', new mongoose.Schema({
    guildID: String,
    userID: String,
    notes: Array
}))

// Code

if (config.LEVELS_SYSTEM.ENABLED) {
    const xp = require('simply-xp')
    xp.connect(config.MONGO_URI, {notify: false})
}

const giveawayModel = giveawayDatabase

const GiveawayManagerWithOwnDatabase = class extends GiveawaysManager {
        async getAllGiveaways() {
            return await giveawayModel.find().lean().exec()
        }
        async saveGiveaway(message, giveaway) {
            return await giveawayModel.create(giveaway), true
        }
        async editGiveaway(message, giveaway) {
            return (
                await giveawayModel.updateOne({ messageId: message }, giveaway, { omitUndefined: true }).exec(),
                    true
            )
        }
        async deleteGiveaway(message) {
            await giveawayModel.deleteOne({ messageId: message }).exec()
            return true
        }
    }

client.player = new Player(client, {
    leaveOnEmpty: config.MUSIC_SYSTEM.LEAVE_ON_EMPTY,
    leaveOnEnd: config.MUSIC_SYSTEM.LEAVE_ON_END,
    leaveOnStop: config.MUSIC_SYSTEM.LEAVE_ON_STOP
})

client.commandsFile = commands
client.config = config
client.messages = mensajes

client.utils = {}

client.utils.checkPermission = (
    client,
    message,
    command,
    reply = 'reply') => {

    if (!client.commandsFile.COMMANDS_CONFIG[command]) {
        return (
            console.error(
                '\x1B[31m[ERROR]\x1B[0m Permissions for command ' +
                command +
                ' not found.'
            ),
                message[reply]("This command doesn't have any permissions."),
                false
        )
    }
    if (
        !message.member.roles.cache.some((role) =>
            client.commandsFile.COMMANDS_CONFIG[command]?.PERMISSIONS.includes(
                role.name
            )
        ) &&
        !message.member.roles.cache.some((role) =>
            client.commandsFile.COMMANDS_CONFIG[command]?.PERMISSIONS.includes(
                role.id
            )
        ) &&
        !client.commandsFile.COMMANDS_CONFIG[command]?.PERMISSIONS.includes(
            message.member.id
        )
    ) {
        return (
            message[reply]({
                embeds: [
                    new MessageEmbed()
                        .setTitle('\uD83D\uDEAB | No Permission')
                        .setDescription(
                            'You do not have sufficient permissions to execute this command.'
                        )
                        .setColor('RED'),
                ],
                ephemeral: true,
            }),
                false
        )
    } else {
        return true
    }
}

client.utils.isEnabled = (
    client,
    message,
    command,
    reply = 'reply') => {
    if (!client.commandsFile.COMMANDS_CONFIG[command]) {
        return (
            console.error(
                '\x1B[31m[ERROR]\x1B[0m Permissions for command ' +
                command +
                ' not found.'
            ),
                message[reply]("This command doesn't have any permissions."),
                false
        )
    }
    if (!client.commandsFile.COMMANDS_CONFIG[command]?.ENABLED) {
        return (
            message[reply]({
                embeds: [
                    new MessageEmbed()
                        .setTitle('\uD83D\uDEAB | Command Disabled')
                        .setDescription('This command is currently disabled.')
                        .setColor('RED'),
                ],
                ephemeral: true,
            }),
                false
        )
    } else {
        return true
    }
}

client.commands = new Collection()
client.cooldown = new Collection()
client.slashCommands = new Collection()

client.database = {
    banDatabase: banDatabase,
    blacklistDatabase: blacklistDatabase,
    blacklistWordsDatabase: blacklistWordsDatabase,
    economyDatabase: economyDatabase,
    giveawayDatabase: giveawayDatabase,
    reactionRolesDatabase: reactionRolesDatabase,
    suggestDatabase: suggestDatabase,
    ticketDatabase: ticketDatabase,
    ticketPanelDatabase: ticketPanelDatabase,
    warnDatabase: warnDatabase,
    notesDatabase: notesDatabase
}

client.giveawaysManager = new GiveawayManagerWithOwnDatabase(client, {
    default: {
        botsCanWin: client.config.GIVEAWAYS.BOTS_CAN_WIN,
        embedColor: client.config.GIVEAWAYS.EMBED_COLOR,
        embedColorEnd: client.config.GIVEAWAYS.EMBED_COLOR_END,
        reaction: client.config.GIVEAWAYS.REACTION,
        extraData: null,
    },
})

require('./handler')(client)

const express = require('express')
const app = express()
const port = process.env.PORT || 5000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

.listen(port, () => {})

client.login(client.config.TOKEN)
