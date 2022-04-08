const { 
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const fetch = require("node-fetch");

module.exports = {
    name: "movie",
    permission: "MOVIE",
    description: "Search for a movie",
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'movie',
            description: 'The movie to search for',
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
        const query = interaction.options.getString('movie');
        const result = await fetch(`https://api.popcat.xyz/imdb?q=${encodeURIComponent(query)}`).then(res => res.json());
        if (result.error) return interaction.reply("No movie found.")
        const embed = new MessageEmbed()
            .setColor("#b39ef3")
            .setThumbnail(result.poster)
            .setURL(result.imdburl)
            .setTitle(result.title)
            .addField("Ratings", result.ratings[0].value, true)
            .addField("Votes", result.votes, true)
            .addField("Country", result.country, true)
            .addField("Languages", result.languages, true)
            .addField("Box Office", result.boxoffice, true)
            .addField("Director", result.director, true)
            .addField("Run Time", result.runtime, true)
            .addField("Type", result.type, true)
            .addField("Released", new Date(result.released).toDateString(), true)
            .setDescription(result.plot.slice(0, 4093) + "..")
        interaction.reply({embeds: [embed]});
    },
};