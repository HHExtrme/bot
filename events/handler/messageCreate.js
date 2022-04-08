const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))
const client = require('../../index');
const simplydjs = require("simply-djs");
const xp = require('simply-xp')
const blacklistWords = client.database.blacklistWordsDatabase;
const blacklistSchema = client.database.blacklistDatabase;

client.on("messageCreate", async (message) => {
    if (config.LEVELS_SYSTEM.ENABLED) {
        if (message.author.bot || !message.guild) return;
        xp.addXP(message, message.author.id, message.guild.id, {
            min: config.LEVELS_SYSTEM.XP_PER_MESSAGE.MIN_XP,
            max: config.LEVELS_SYSTEM.XP_PER_MESSAGE.MAX_XP,
        })
    };
    if (config.CHAT_BOT.ENABLED) {
        if (message.author.bot || !message.guild) return;
        simplydjs.chatbot(client, message, {
            chid: config.CHAT_BOT.CHANNEL_ID,
            name: config.CHAT_BOT.BOT_NAME,
            developer: config.CHAT_BOT.DEVELOPER,
        });
    };
    if (config.BLACKLIST_WORDS.ENABLED) {
        if (message.author.bot || !message.guild) return;
        if (!message.member.roles.cache.some(r => config.BLACKLIST_WORDS.ROLES_BYPASS.includes(r.id))) {
            const guildData = await blacklistWords.findOne({ guildID: message.guild.id });
            if (!guildData) return;
            const words = guildData.words;
            const array = message.content.split(' ').filter(w => w !== '');
            if (array.some(w => words.includes(w))) {
                message.delete();
                return message.channel.send(`${message.author} please don't use blacklisted words.`);
            }
        }
    }
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(client.config.PREFIX)) return;
    const blacklistData = await blacklistSchema.findOne({ guildID: message.guild.id });
    if (blacklistData) {
        if (blacklistData.memberID.includes(message.author.id)) {
            message.delete();
            return message.channel.send({embeds: [{
                title: 'Message Deleted',
                description: `${message.author} your message has been deleted because you are blacklisted from this server.`,
                    color: 16711680,
                }]
            }).then(m => {
                setTimeout(() => m.delete(), 5000)
            });
    }};

    const [cmd, ...args] = message.content
        .slice(client.config.PREFIX.length)
        .trim()
        .split(" ");

    const command = client.commands.get(cmd.toLowerCase()) || client.commands.find(c => c.aliases?.includes(cmd.toLowerCase()));
    if (!command) return;

    if (!client.utils.isEnabled(client, message, command.permission)) return;
    if (!client.utils.checkPermission(client, message, command.permission)) return;

    await command.run(client, message, args);
});
