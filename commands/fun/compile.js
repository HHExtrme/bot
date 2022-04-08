const {
    Client, 
    Message, 
    MessageEmbed 
} = require("discord.js");
const yaml = require('js-yaml');
const fs = require('fs');
const API_ZERO = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2)).API_KEYS.ZERO_TWO;
const fetch = require('node-fetch');

module.exports = {
    name: "compile",
    permission: "COMPILE",
    description: "Compiles node.js code",
    /**
     *
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        const code = args.join(" ");
        
        if (!code) {
            const embed = new MessageEmbed()
                .setAuthor({name: "| No code", iconURL: client.user.avatarURL()})
                .setColor("RED")
                .setDescription("No code provided");
            return message.reply({embeds: [embed]});
        }
        let msg1 = await message.reply({embeds: [new MessageEmbed().setDescription(`${message.author} Compiling...`).setColor("#2f3136")]})
        const response = await fetch(`https://api.notzerotwo.ml/text/compile?api=${API_ZERO}&code=${code}&language=javascript-node`);
        const data = await response.json();
        if (data.error) {
            return msg1.edit({embeds: [new MessageEmbed().setDescription(`${message.user} ${data.error}`).setColor("#2f3136")]})
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
                    .addField('📥 Input', `[Click Here](${input.url})`)
                    .addField('📤 Output', `[Click Here](${output.url})`)
                    .addField('📁 Type', `\`\`\`code\`\`\``, true)
                    .addField('🕥 Time', `\`\`\`${data.realTime}\`\`\``, true)
                msg1.edit({embeds: [embed]})
            } else {
                const embed = new MessageEmbed()
                    .setColor('#2f3136')
                    .addField('📥 Input', `\`\`\`js\n${code}\`\`\``)
                    .addField('📤 Output', `\`\`\`js\n${data.output}\`\`\``)
                    .addField('📁 Type', `\`\`\`code\`\`\``, true)
                    .addField('🕥 Time', `\`\`\`${data.realTime}\`\`\``, true)
                msg1.edit({embeds: [embed]})
            }
        }
    },
};