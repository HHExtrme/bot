const { Client, Message, MessageEmbed } = require('discord.js'),
    paginationEmbed = require('../../functions/paginationEmbed'),
    fs = require('fs'),
    yaml = require('js-yaml')

module.exports = {
    name: 'command',
    permission: 'COMMAND',
    aliases: ['commands'],
    category: ['admin'],
    run: async (client, message, args) => {
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
                    .setFooter({text: `Use ${client.config.PREFIX}command <command> <enable|disable> to change the status of a command.`});
                return embed;
            });

            paginationEmbed(message, embeds, "5m", true);
        } else {
            const command = args[0]?.toUpperCase();
            const status = args[1];

            if (!command || !status) return message.reply("Please provide a command and a status.");
            if (!["enable", "disable"].includes(status)) return message.reply("Please provide a valid status.");

            const commandFile = yaml.load(fs.readFileSync("../../config/commands.yml", "utf8"), 4);
            if (!commandFile.COMMANDS_CONFIG[command]) return message.reply("That command doesn't exist.");

            if (status === "enable") {
                commandFile.COMMANDS_CONFIG[command].ENABLED = true;
                fs.writeFileSync("../../config/commands.yml", yaml.dump(commandFile, 4), "utf8");
                client.commandsFile = yaml.load(fs.readFileSync("../../config/commands.yml", "utf8"), 4);
                message.reply({embeds: [
                        new MessageEmbed()
                            .setTitle("Enabled command!")
                            .setDescription(`Enabled command **${capitalizar(command)}**.`)
                            .setColor("GREEN")
                    ]});
            } else {
                commandFile.COMMANDS_CONFIG[command].ENABLED = false;
                fs.writeFileSync("../../config/commands.yml", yaml.dump(commandFile, 4), "utf8");
                client.commandsFile = yaml.load(fs.readFileSync("../../config/commands.yml", "utf8"), 4);
                message.reply({embeds: [
                        new MessageEmbed()
                            .setTitle("Disabled command!")
                            .setDescription(`Disabled command **${capitalizar(command)}**.`)
                            .setColor("RED")
                    ]});
            }
        }
    },
}
function capitalizar(string) {
    return (
        (string = string.toLowerCase()),
            (string = string.charAt(0).toUpperCase() + string.slice(1)),
            string
    )
}
