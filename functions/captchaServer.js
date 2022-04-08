// <- Packages ->
const crypto = require('crypto');
const client = require('../index')
const { MessageEmbed } = require('discord.js');

// <- Variables ->
let linkPool = [];
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2));

// <- Functions ->
// Create a link ID for a user
function createLink(discordID) {
    const linkID = crypto.randomBytes(4).toString('hex');
    linkPool.push({
        discordID: discordID,
        linkID: linkID,
    });
    setTimeout(function() {
        if (isValidLink(linkID)) {
            removeLink(linkID);
            sendMessageFailed(discordID);
        }
    }, 900000);
    return linkID;
}

// Checks if link ID exists
function isValidLink(linkID) {
    for (let i = 0; i < linkPool.length; i++) if (linkPool[i].linkID == linkID) {
        return true;
    } else return false;
    
}

// Remove link
function removeLink(linkID) {
    for (let i = 0; i < linkPool.length; i++) if (linkPool[i].linkID == linkID) delete linkPool[i];
    linkPool = linkPool.filter(n => n);
    return true;
}

// Get Discord ID from link ID
function getDiscordId(linkID) {
    for (let i = 0; i < linkPool.length; i++) if (linkPool[i].linkID == linkID) return linkPool[i].discordID;
    return false;
}

// Add verified role to user
async function addRole(userID) {
    try {
        const guild = await client.guilds.fetch(config.GUILD_ID);
        const role = await guild.roles.fetch(config.VERIFY_WEB_SYSTEM.ROLE_ID);
        const member = await guild.members.fetch(userID);
        member.roles.add(role).catch((e) => {
            console.error(e)
        });
    } catch (e) {
        console.error(e + " Failed to add role to user " + userID);
    }
}

// Edit the message in the DM of the user!
async function sendMessage(userID) {
    try {
        const member = await client.guilds.cache.get(config.GUILD_ID).members.fetch(userID);
        const message = (await member.createDM()).lastMessage;
        const embed = new MessageEmbed()
            .setAuthor({name: "Verification System"})
            .addField("Origin server", member.guild.name, true)
            .addField("Status", "Verified!", true)
            .setImage("https://media.discordapp.net/attachments/818019345078419486/864549367825039370/verification_screen.PNG?width=794&height=473")
            .setColor("GREEN");
        await message.edit({embeds: [embed]});
    } catch (e) {
        console.error(`Failed to send message to user ${userID}!`);
    }
}

// Edit the message in the DM of the user for failed verification!
async function sendMessageFailed(userID) {
    try {
        const member = await client.guilds.cache.get(config.GUILD_ID).members.fetch(userID);
        const message = (await member.createDM()).lastMessage;
        const embed = new MessageEmbed()
            .setAuthor({name: "Verification System"})
            .addField("Origin server", member.guild.name, true)
            .addField("Status", "Session expired", true)
            .addField("What happened?", "You have taken over 15 minutes to verify, therefore your token has expired. If this was due to a technical difficulty,", false)
            .setImage("https://media.discordapp.net/attachments/818019345078419486/864549367825039370/verification_screen.PNG?width=794&height=473")
            .setColor("ORANGE");
        await message.edit({embeds: [embed]});
    } catch (e) {

    }
}

// <- Exports ->

module.exports = {
    getDiscordId,
    sendMessage,
    isValidLink,
    removeLink,
    createLink,
    addRole,
    sendMessageFailed
};