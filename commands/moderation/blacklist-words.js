const { 
    Client, 
    Message, 
    MessageEmbed 
} = require('discord.js');

module.exports = {
    name: "blacklist-words",
    permission: "BLACKLIST_WORDS",
    aliases: ["blacklist-word"],
    category: ["moderation"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const blacklistWords = client.database.blacklistWordsDatabase;

        const subCommands = ["add", "remove", "list"];
        const subCommand = args[0];
        if (!subCommands.includes(subCommand)) return message.channel.send(`Please specify a valid sub-command. Valid sub-commands are: \`${subCommands.join("`, `")}\``);
        if (subCommand === "add") {
            const word = args.splice(1).join(" ");
            if (!word) return message.channel.send("Please specify a word to add to the blacklist.");
            const array = word.split(' ').filter(w => w !== '');
            if (array.length > 9) {
                return message.channel.send("You can only add up to 10 words at a time.");
            }
            const guildData = await blacklistWords.findOne({ guildID: message.guild.id });
            if (!guildData) {
                const newGuildData = new blacklistWords({
                    guildID: message.guild.id,
                    words: [...array]
                });
                await newGuildData.save();
                return message.channel.send(`Successfully added ${array.join(", ")} to the blacklist.`);
            } else {
                const newWords = [...guildData.words, ...array];
                await blacklistWords.findOneAndUpdate({ guildID: message.guild.id }, { words: newWords });
                return message.channel.send(`Successfully added ${array.join(", ")} to the blacklist.`);
            }
        } else if (subCommand === "remove") {
            const word = args[1];
            if (!word) return message.channel.send("Please specify a word to remove from the blacklist.");
            const array = word.split(' ').filter(w => w !== '');
            const guildData = await blacklistWords.findOne({ guildID: message.guild.id });
            if (!guildData) return message.channel.send("There are no words in the blacklist.");
            const newWords = guildData.words.filter(w => !array.includes(w));
            await blacklistWords.findOneAndUpdate({ guildID: message.guild.id }, { words: newWords });
            return message.channel.send(`Successfully removed ${array.join(", ")} from the blacklist.`);
        } else if (subCommand === "list") {
            const guildData = await blacklistWords.findOne({ guildID: message.guild.id });
            if (!guildData) return message.channel.send("There are no words in the blacklist.");
            const words = guildData.words.join(", ");
            const embed = new MessageEmbed()
                .setTitle("Blacklisted Words")
                .setDescription(`${words}`)
                .setColor("#ff0000");
            return message.channel.send({embeds: [embed]});
        }
    },
};