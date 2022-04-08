const { 
    Client, 
    CommandInteraction, 
    MessageEmbed
 } = require("discord.js");
const fetch = require("node-fetch");
const moment = require("moment");

module.exports = {
    name: "npm",
    permission: "NPM",
    description: "Search for a package on npm",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'package',
            description: 'The package to search for',
            type: 'STRING',
            required: true
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        let query = interaction.options.getString('package');
        const res = await fetch(`https://registry.npmjs.com/${encodeURIComponent(query)}`).catch((err) => console.log(err));
        if (res.status === 404) return interaction.reply(`Package \`${query}\` not found`);
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
        interaction.reply({ embeds: [embed] });
    },
};