const { Client, Message, MessageEmbed } = require("discord.js");

module.exports = {
    name: "troll",
    permission: "TROLL",
    description: "Troll a user.",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const member = message.mentions.members.first();
        const times = parseInt(args[1]);
        if (!times) {
            return message.reply("You need to specify how many times to troll.");
        }
        if (member) {
            const a = await message.reply(`Trolling ${member.user.tag} ${times} times.`);
            const random = Math.floor(Math.random() * 3) + 5;
            let str = `<@!${member.id}>`
            for (let i = 0; i < times; i++) {
                await message.channel.send(str.repeat(random));
            }
            a.edit(`Done.`);
        } else {
            const embed = new MessageEmbed()
                .setTitle("Troll")
                .setDescription("You need to specify a user to troll.")
                .setColor("#ff0000");
            message.reply(embed);
        }
    },
};