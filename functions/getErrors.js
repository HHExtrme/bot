const yaml = require('js-yaml');
const fs = require('fs');
const commands = yaml.load(fs.readFileSync('config/commands.yml', 'utf8', 2));
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2));

async function getPermissionsErrors(guild, file = commands) {
    return new Promise(async (resolve, reject) => {
        if (!guild) return reject(" |- No guild provided");
        let errors = [];
        Object.values(file.PERMISSIONS).forEach(value => {
            if (!guild.roles.cache.find(role => role.name == value) && !guild.roles.cache.find(role => role.id == value)) {
                errors.push(` |- I have not found any role with the name/id ${value.join(', ')}`);
            }
        });
        if (!errors || errors.length <= 0) {
            return resolve(" |- No errors found in commands.yml file");
        } else {
            errors = errors.filter((value, index, self) => self.indexOf(value) === index);
            return resolve(errors.join('\n'));
        }
    });
}

async function getConfigErrors(guild, file = config) {
    return new Promise(async (resolve, reject) => {
        if (!guild) return reject(" |- No guild provided");
        let errors = [];
        
        if (!guild.channels.cache.find(channel => channel.id == file.WELCOME_SYSTEM.CHANNEL_ID)) {
            errors.push(` |- I have not found any channel with the id ${file.WELCOME_SYSTEM.CHANNEL_ID}`);
        }
        if (!guild.channels.cache.find(channel => channel.id == file.LEAVE_SYSTEM.CHANNEL_ID)) {
            errors.push(` |- I have not found any channel with the id ${file.LEAVE_SYSTEM.CHANNEL_ID}`);
        }
        if (!guild.channels.cache.find(channel => channel.id == file.SUGGEST_SYSTEM.CHANNEL_ID)) {
            errors.push(` |- I have not found any channel with the id ${file.SUGGEST_SYSTEM.CHANNEL_ID}`);
        }
        if (!guild.channels.cache.find(channel => channel.id == file.POLL_SYSTEM.CHANNEL_ID)) {
            errors.push(` |- I have not found any channel with the id ${file.POLL_SYSTEM.CHANNEL_ID}`);
        }
        if (!guild.channels.cache.find(channel => channel.id == file.CHAT_BOT.CHANNEL_ID)) {
            errors.push(` |- I have not found any channel with the id ${file.CHAT_BOT.CHANNEL_ID}`);
        }
        if (!guild.channels.cache.find(channel => channel.id == file.LOGS_SYSTEM.CHANNEL_ID)) {
            errors.push(` |- I have not found any channel with the id ${file.LOGS_SYSTEM.CHANNEL_ID}`);
        }

        if (!guild.roles.cache.find(role => role.id == file.AUTOROLE.MEMBER.ROLE_ID)) {
            errors.push(` |- I have not found any role with the id ${file.AUTOROLE.MEMBER.ROLE_ID}`);
        }
        if (!guild.roles.cache.find(role => role.id == file.AUTOROLE.BOT.ROLE_ID)) {
            errors.push(` |- I have not found any role with the id ${file.AUTOROLE.BOT.ROLE_ID}`);
        }
        if (!guild.roles.cache.find(role => role.id == file.VERIFY_SYSTEM.ROLE_ID)) {
            errors.push(` |- I have not found any role with the id ${file.VERIFY_SYSTEM.ROLE_ID}`);
        }
        if (errors.length <= 0) {
            return resolve(" |- No errors found in config.yml file");
        } else {
            errors = errors.filter((value, index, self) => self.indexOf(value) === index);
            return resolve(errors.join('\n'));
        }
    });
}

module.exports = {
    getPermissionsErrors,
    getConfigErrors
}