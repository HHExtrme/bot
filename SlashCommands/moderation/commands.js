const { Client, CommandInteraction, MessageEmbed } = require("discord.js");
const paginationEmbed = require("../../functions/paginationEmbed")
const fs = require("fs");
const yaml = require("js-yaml");

module.exports = {
    name: "command",
    permission: "COMMAND",
    description: "This command is used for bot developers to check errors",
    type: 'CHAT_INPUT',
    options: [
        {
            name: "command",
            description: "The command you want to enable/disable",
            type: "STRING",
            required: false
        },
        {
            name: "status",
            description: "The status you want to set the command to",
            type: "STRING",
            choices: [
                {
                    name: "enable",
                    value: "enable"
                },
                {
                    name: "disable",
                    value: "disable"
                }
            ],
            required: false
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const subcommand = args[0];
        if (!subcommand) {
            const commandFile = client.commandsFile.COMMANDS_CONFIG;
            const format = Object.keys(commandFile).map(command => {
                return {
                    name: capitalizar(command),
                    enabled: commandFile[command].ENABLED ? "✅" : "❌",
                }
            });
    
            const chunks = [];
            for (let i = 0; i < format.length; i += 15) {
                chunks.push(format.slice(i, i + 15));
            }
    
            // create the embeds
            const embeds = chunks.map((chunk, index) => {
                const embed = new MessageEmbed()
                    .setTitle(`Commands (Page ${index + 1}/${chunks.length})`)
                    .setColor("#0099ff")
                    .setDescription(chunk.map(command => `${command.enabled} **${command.name}**`).join("\n"))
                    .setFooter({text: `Use /command command:command> status:<enable|disable> to change the status of a command.`});
                return embed;
            });
    
            paginationEmbed(interaction, embeds, "5m", true);
        } else {
            const command = interaction.options.getString("command")?.toUpperCase();
            const status = interaction.options.getString("status");

            if (!command || !status) return interaction.reply("Please provide a command and a status.");
            if (!["enable", "disable"].includes(status)) return interaction.reply("Please provide a valid status.");


            const commandFile = yaml.load(fs.readFileSync("../../config/commands.yml", "utf8"), 4);
            if (!commandFile.COMMANDS_CONFIG[command]) return interaction.reply("That command doesn't exist.");

            if (status === "enable") {
                commandFile.COMMANDS_CONFIG[command].ENABLED = true;

                fs.writeFileSync("../../config/commands.yml", yaml.dump(commandFile, 4), "utf8");
                client.commandsFile = yaml.load(fs.readFileSync("../../config/commands.yml", "utf8"), 4);
                interaction.reply({embeds: [
                    new MessageEmbed()
                        .setTitle("Enabled command!")
                        .setDescription(`Enabled command **${capitalizar(command)}**.`)
                        .setColor("GREEN")
                ]});
            } else {
                commandFile.COMMANDS_CONFIG[command].ENABLED = false;
                fs.writeFileSync("../../config/commands.yml", yaml.dump(commandFile, 4), "utf8");
                client.commandsFile = yaml.load(fs.readFileSync("../../config/commands.yml", "utf8"), 4);
                interaction.reply({embeds: [
                    new MessageEmbed()
                        .setTitle("Disabled command!")
                        .setDescription(`Disabled command **${capitalizar(command)}**.`)
                        .setColor("RED")
                ]});
            }
        }
    },
};

 function capitalizar(string) {
    string = string.toLowerCase();
    string = string.charAt(0).toUpperCase() + string.slice(1);
    return string;
}