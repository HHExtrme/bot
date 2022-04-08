const { 
    Client, 
    Message, 
    MessageEmbed 
} = require('discord.js');

module.exports = {
    name: "blacklist",
    permission: "BLACKLIST",
    aliases: ["bl"],
    category: ["admin"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const blacklistSchema = client.database.blacklistDatabase;

        const subCommand = args[0];
        const embed = new MessageEmbed()
            .setColor('AQUA')
            .setTitle("**Blacklist Command**")
            .setDescription("This command is used to blacklist users from using the bot.")
            .addField("Subcommands:", "`add` - Add a user to the blacklist\n`remove` - Remove a user from the blacklist\n`list` - List all users in the blacklist\n`help` - Show this message")
            .setFooter("requested by " + message.author.tag, message.author.displayAvatarURL())
        if (!subCommand) return message.channel.send({embeds: [embed]});
        if (subCommand === "add") {
            const user = message.mentions.users.first() || message.guild.members.cache.get(args[1]);
            if (!user) return message.channel.send(`${message.author} Please provide a user to blacklist!`);
            
            const guildData = await blacklistSchema.findOne({ guildID: message.guild.id });
            if (!guildData) {
                const newGuild = new blacklistSchema({
                    guildID: message.guild.id,
                    memberID: [user.id],
                });
                newGuild.save();
            } else {
                if (!guildData.memberID.includes(user.id)) {
                    guildData.memberID.push(user.id);
                    guildData.save();
                } else {
                    return message.channel.send(`${message.author} This user is already blacklisted!`);
                }
            }
            const embed = new MessageEmbed()
                .setTitle(`${user.tag} has been blacklisted!`)
                .setColor(0x00AE86)
                .setDescription(`${user.tag} has been blacklisted from ${message.guild.name}!`)
                .setFooter(`Blacklisted by ${message.author.tag}`);
            message.channel.send({embeds: [embed]})
        } else if (subCommand == "remove") {
            const user = message.mentions.users.first() || message.guild.members.cache.get(args[0]);
            if (!user) return message.channel.send(`${message.author} Please provide a user to whitelist!`);
    
            const guildData = await blacklistSchema.findOne({ guildID: message.guild.id });
            if (!guildData) {
                return message.channel.send(`${message.author} This guild no have users blacklisted!`);
            } else {
                if (guildData.memberID.includes(user.id)) {
                    guildData.memberID.splice(guildData.memberID.indexOf(user.id), 1);
                    guildData.save();
                } else {
                    return message.channel.send(`${message.author} This user is not blacklisted!`);
                }
            }
            const embed = new MessageEmbed()
                .setTitle(`${user.tag} has been whitelisted!`)
                .setColor(0x00AE86)
                .setDescription(`${user.tag} has been whitelisted from ${message.guild.name}!`)
                .setFooter(`Whitelisted by ${message.author.tag}`);
            message.channel.send({embeds: [embed]})
        } else if (subCommand == "list") {
            const guildData = await blacklistSchema.findOne({ guildID: message.guild.id });
            if (!guildData) {
                return message.channel.send(`${message.author} This guild no have users blacklisted!`);
            } else {
                if (!guildData.memberID) {
                    return message.channel.send(`${message.author} This guild no have users blacklisted!`);
                }
                const embed = new MessageEmbed()
                    .setTitle(`Blacklisted users in ${message.guild.name}`)
                    .setColor(0x00AE86)
                    .setDescription(`${guildData.memberID.map(id => `<@${id}>`).join('\n')}`)
                    .setFooter(`Blacklisted by ${message.author.tag}`);
                message.channel.send({embeds: [embed]})
            }
        }
    },
};