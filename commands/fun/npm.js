const { 
    Client, 
    Message, 
    MessageEmbed
 } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");

module.exports = {
    name: "npm",
    permission: "NPM",
    description: "Search for a package on npm",
    type: 'CHAT_INPUT',
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        let query = args.join(" ");
        if (!query) return message.channel.send({embeds: [new MessageEmbed().setColor("#2f3136").setDescription("Please provide a package name to search for.")]});
        const res = await fetch(`https://registry.npmjs.com/${encodeURIComponent(query)}`).catch((err) => console.log(err));
        if (res.status === 404) return message.reply(`Package \`${query}\` not found`);
        const body = await res.json();
        const embed = new MessageEmbed()
          .setColor("RED")
          .setTitle(body.name)
          .setURL(`https://www.npmjs.com/package/${body.name}`)
          .setDescription(body.description || "No description.")
          .addField("❯ Version", body["dist-tags"].latest, true)
          .addField("❯ License", body.license || "None", true)
          .addField("❯ Author", body.author ? body.author.name : "???", true)
          .addField("❯ Creation Date", moment.utc(body.time.created).format("YYYY/MM/DD hh:mm:ss"), true)
          .addField("❯ Modification Date", body.time.modified? moment.utc(body.time.modified).format("YYYY/MM/DD hh:mm:ss") : "None", true)
          .addField("❯ Repository", body.repository ? `[View Here](${body.repository.url.split("+")[1]})` : "None", true)
          .addField("❯ Maintainers", body.maintainers.map((user) => user.name).join(", "));
        message.reply({ embeds: [embed] });
    },
};