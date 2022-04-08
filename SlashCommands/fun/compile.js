const {
    Client, 
    CommandInteraction, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const { API_ZERO } = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))
const fetch = require('node-fetch');

module.exports = {
    name: "compile",
    permission: "COMPILE",
    description: "Compiles node.js code",
    type: 'CHAT_INPUT',
    options : [
        {
            name: 'code',
            description: 'The code to compile',
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
        const code = interaction.options.getString('code');
        await interaction.reply({embeds: [new MessageEmbed().setDescription(`${interaction.user} Compiling...`).setColor("#2f3136")]})
        const response = await fetch(`https://api.notzerotwo.ml/text/compile?api=${API_ZERO}&code=${code}&language=javascript-node`);
        const data = await response.json();
        if (data.error) {
            interaction.fetchReply()
            return interaction.editReply({embeds: [new MessageEmbed().setDescription(`${interaction.user} ${data.error}`).setColor("#2f3136")]})
        } else {
            const jsp = require('jspaste');
            if (data.output.length > 1000) {
                let input = await jsp.publish(
                    `- - - - Input - - - -\n\n${code}`
                );
                let output = await jsp.publish(
                    `- - - - Output - - - -\n\n${data.output}`
                );
                const embed = new MessageEmbed()
                    .setColor('#2f3136')
                    .addField('<:code:919738201097257020> Input', `[Click Here](${input.url})`)
                    .addField('<:cmd:919738201239855125> Output', `[Click Here](${output.url})`)
                    .addField('<:folder:919738251244363787> Type', `\`\`\`code\`\`\``, true)
                    .addField('<:hours_glass:919738251248562247> Time', `\`\`\`${data.realTime}\`\`\``, true)
                interaction.editReply({embeds: [embed]})
            } else {
                const embed = new MessageEmbed()
                    .setColor('#2f3136')
                    .addField('<:code:919738201097257020> Input', `\`\`\`js\n${code}\`\`\``)
                    .addField('<:cmd:919738201239855125> Output', `\`\`\`js\n${data.output}\`\`\``)
                    .addField('<:folder:919738251244363787> Type', `\`\`\`code\`\`\``, true)
                    .addField('<:hours_glass:919738251248562247> Time', `\`\`\`${data.realTime}\`\`\``, true)
                interaction.editReply({embeds: [embed]})
            }
        }
    },
};