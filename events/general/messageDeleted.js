const { MessageEmbed } = require('discord.js');
const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

client.on("messageDelete", async (message) => {
    if (message.author.bot) return;
    client.snipes = new Map();
    let snipes = client.snipes.get(message.channel.id) || [];
    if (snipes.length > 5) snipes = snipes.slice(0, 4);

    snipes.unshift({
      msg: message,
      image: message.attachments.first()?.proxyURL || null,
    });
    client.snipes.set(message.channel.id, snipes);
    if (!config.LOGS_SYSTEM.LOG_ENABLED) return;
    if (config.LOGS_SYSTEM.ENABLED.includes("MessageDeleted")) {
        const embed = new MessageEmbed()
            .setTitle("Message Deleted")
            .setFooter("Logged by: " + message.guild.me.displayName)
            .addField("Author:", `<@${message.author.id}> \`[${message.author.tag}]\``)
            .addField("Channel:", `<#${message.channel.id}>`)
            .addField("Message:", "```" + message.content + "```")
            .setImage(message.attachments.first()?.proxyURL || null)
            .setColor("AQUA")
            .setTimestamp();
        try {
            await message.guild.channels.cache.get(config.LOGS_SYSTEM.CHANNEL_ID).send({embeds: [embed]});
        } catch (error) {
            console.error(error);
        }
    };
});