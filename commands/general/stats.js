const { 
  Client, 
  Message, 
  MessageEmbed } = require('discord.js');

module.exports = {
  name: "stats",
  permission: "STATS",
  aliases: ["statistics"],
  category: ["general"],
  /**
   * @param {Client} client
   * @param {Message} message
   * @param {String[]} args
   */
  run: async (client, message, args) => {    
    // send the cpu usage of the bot
    let ping = Date.now() - message.createdTimestamp
    const embed = new MessageEmbed()
        .setTitle("Stats from `"+ `${message.guild.me.user.tag}` +"`")
        .setColor("AQUA")
        .setThumbnail(client.user.displayAvatarURL())
        .setFooter(`Requested by ${message.author.username}`, message.author.displayAvatarURL())
        .setTimestamp()
        .addField("🏓 Ping", "┕`"+ ping +"ms`", true)
        .addField("🕙 Uptime", "┕`"+ `${Math.round(client.uptime / 1000 / 60 / 60)}h, ${Math.round(client.uptime / 1000 / 60 % 60)}m, ${Math.round(client.uptime / 1000 % 60)}s` +"`", true)
        .addField("🗄️ Memory", "┕`"+ `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024 * 100) / 100} MB` +"`", true)
        .addField("🎛️ CPU", "┕`"+`${Math.round(process.cpuUsage().user / 1024 / 1024 * 100) / 100}%`+"`", true)
        .addField("👥 Users", "┕`"+`${client.users.cache.size}`+"`", true)
        .addField("⚙️ WS Latency", "┕`"+`${client.ws.ping}`+"ms`", true)
        .addField("🤖 Version", "┕`"+`1.0.0`+"`", true)
        .addField("📘 Discord.js", "┕`"+`${require('discord.js').version}`+"`", true)
        .addField("📗 Node", "┕`"+`${process.version}`+"`", true)
    message.channel.send({
        embeds: [embed]
    })
  },
};