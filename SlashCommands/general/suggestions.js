const {
    MessageEmbed,
    CommandInteraction,
} = require('discord.js')
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))
if (config.SUGGEST_SYSTEM.ENABLED === false) return;

module.exports = {
    name: 'suggestion',
    permission: 'SUGGEST_SYSTEM',
    description: 'Suggestion System!',
    type: 'CHAT_INPUT',
    options: [
        {
            name: 'suggest',
            type: 'SUB_COMMAND',
            description: 'Send a suggestion',
            options: [{
                name: 'query',
                description: 'Your Suggestion',
                type: 'STRING',
                required: true,
            }, ],
        },
        {
            name: 'accept',
            type: 'SUB_COMMAND',
            description: 'Accept a suggestion',
            options: [{
                name: 'token',
                description: 'Suggestion Token',
                type: 'STRING',
                required: true,
            }, {
                name: 'reply',
                description: 'Your reply for the Suggestion',
                type: 'STRING',
                required: true,
            }, ],
        },
        {
            name: 'decline',
            type: 'SUB_COMMAND',
            description: 'Decline a suggestion',
            options: [{
                name: 'token',
                description: 'Suggestion Token',
                type: 'STRING',
                required: true,
            }, {
                name: 'reply',
                description: 'Your reply for the Suggestion',
                type: 'STRING',
                required: true,
            }, ],
        }
    ],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const [SubCommand] = args;

        const emojiYes = config.SUGGEST_SYSTEM.EMOJIS.UPVOTE;
        const emojiNo = config.SUGGEST_SYSTEM.EMOJIS.DOWNVOTE;
        let channelData = config.SUGGEST_SYSTEM.CHANNEL_ID

        if (SubCommand === 'suggest') {
            const suggestion = interaction.options.getString('query');
            const suggestionSchema = client.database.suggestDatabase;

            if (!channelData) {
                return interaction.reply({embeds: [new MessageEmbed().setDescription('This server no have a channel set up!').setColor("#2f3136")], ephemeral: true});
            } else {
                const pass = generateToken();
                const suggestionChannel = interaction.guild.channels.cache.get(channelData);

                const suggestEmbed = new MessageEmbed()
                    .setTitle('Suggestion System')
                    .setDescription(`>>> "${suggestion}"`)
                    .setColor(config.SUGGEST_SYSTEM.COLORS.PENDING)
                    .setFooter(`${interaction.user.tag}'s suggestion | ID: ${pass}`, interaction.member.user.displayAvatarURL());
                suggestionChannel.send({embeds: [suggestEmbed]}).then((m) => {
                    const replyEmbed = new MessageEmbed()
                        .setTitle('Suggestion System')
                        .setDescription(`Your [Suggestion](https://discord.com/channels/${interaction.guild.id}/${channelData}/${m.id}) has been sent!`)
                        .setColor("#2f3136");
                    interaction.reply({embeds: [replyEmbed], ephemeral: true});
                    m.react(emojiYes);
                    m.react(emojiNo);
                    new suggestionSchema({
                        guild: interaction.guild.id,
                        message: m.id,
                        token: pass,
                        suggestion: suggestion,
                        user: interaction.user.id,
                        guild: interaction.guild.id,
                    }).save();
                })
            }
        } else if (SubCommand === 'decline') {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return interaction.reply({embeds: [new MessageEmbed().setDescription('You need the **MANAGE_MESSAGES** permission to use this command!').setColor("#2f3136")], ephemeral: true});
            }
            const stoken = interaction.options.getString('token');
            const reply = interaction.options.getString('reply')
            const Schema = client.database.suggestDatabase;
            Schema.findOne({
                token: stoken,
            }, async (err, data) => {
                if (!data) return interaction.reply({embeds: [new MessageEmbed().setDescription('This token is not valid!').setColor("#2f3136")], ephemeral: true});
                const message = data.message
                const user = client.users.cache.get(data.user)
                const guild = data.guild
                const suggestion = data.suggestion

                if (interaction.guild.id != guild) return interaction.reply({embeds: [new MessageEmbed().setDescription('This token is not valid!').setColor("#2f3136")], ephemeral: true});
                const channel = channelData;
                const gchannel = interaction.guild.channels.cache.get(channel);
                if (!gchannel) return interaction.reply({embeds: [new MessageEmbed().setDescription('This server no have a channel set up!').setColor("#2f3136")], ephemeral: true});
                const reactionsYES = await gchannel.messages.fetch(message).then(m => m.reactions.cache.get(emojiYes).count || 0);
                const reactionsNO = await gchannel.messages.fetch(message).then(m => m.reactions.cache.get(emojiNo).count || 0);
                if (channel) {
                    var options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const embed = new MessageEmbed()
                        .setTitle('Suggestion System')
                        .setColor(config.SUGGEST_SYSTEM.COLORS.REJECTED)
                        .setDescription(`>>> "${suggestion}"`)
                        .addField("Updated on the "+ new Date().toLocaleDateString("en-US", options), `>>> Rejected by ${interaction.user.username}\n${reply}`, true)
                        .addField("Statistics", `${interaction.guild.emojis.cache.get(emojiYes)} ${reactionsYES} upvotes\n${interaction.guild.emojis.cache.get(emojiNo)} ${reactionsNO} downvotes`, true)
                        .setFooter(`${user.tag}'s suggestion | ID: ${stoken}`, user.displayAvatarURL({dynamic: true}));
                    gchannel.messages.fetch(message).then(m => m.edit({embeds: [embed]}));
                    interaction.reply({embeds: [new MessageEmbed().setDescription('Suggestion has been declined!').setColor("#2f3136")], ephemeral: true});
                }
            });
        } else if (SubCommand === 'accept') {
            if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
                return interaction.reply({embeds: [new MessageEmbed().setDescription('You need permissions to use this command!').setColor("#2f3136")], ephemeral: true});
            }
            const stoken = interaction.options.getString('token');
            const reply = interaction.options.getString('reply')
            const Schema = client.database.suggestDatabase;

            Schema.findOne({
                token: stoken,
            }, async (err, data) => {
                if (!data) return interaction.reply({embeds: [new MessageEmbed().setDescription('This token is not valid!').setColor("#2f3136")], ephemeral: true});
                const message = data.message
                const user = client.users.cache.get(data.user)
                const guild = data.guild
                const suggestion = data.suggestion

                if (interaction.guild.id != guild) return interaction.reply({embeds: [new MessageEmbed().setDescription('This token is not valid!').setColor("#2f3136")], ephemeral: true});
                const channel = channelData;
                const gchannel = interaction.guild.channels.cache.get(channel);
                if (!gchannel) return interaction.reply({embeds: [new MessageEmbed().setDescription('This server no have a channel set up!').setColor("#2f3136")], ephemeral: true});
                const reactionsYES = await gchannel.messages.fetch(message).then(m => m.reactions.cache.get(emojiYes).count || 0);
                const reactionsNO = await gchannel.messages.fetch(message).then(m => m.reactions.cache.get(emojiNo).count || 0);
                if (channel) {
                    var options = { year: 'numeric', month: 'long', day: 'numeric' };
                    const embed = new MessageEmbed()
                        .setTitle('Suggestion System')
                        .setColor(config.SUGGEST_SYSTEM.COLORS.ACCEPTED)
                        .setDescription(`>>> "${suggestion}"`)
                        .addField("Updated on the "+ new Date().toLocaleDateString("en-US", options), `>>> Accepted by ${interaction.user.username}\n${reply}`, true)
                        .addField("Statistics", `${interaction.guild.emojis.cache.get(emojiYes)} ${reactionsYES} upvotes\n${interaction.guild.emojis.cache.get(emojiNo)} ${reactionsNO} downvotes`, true)
                        .setFooter(`${user.tag}'s suggestion | ID: ${stoken}`, user.displayAvatarURL({dynamic: true}));
                    gchannel.messages.fetch(message).then(m => m.edit({embeds: [embed]}));
                    interaction.reply({embeds: [new MessageEmbed().setDescription('Suggestion has been accepted!').setColor("#2f3136")], ephemeral: true});
                }
            });
        }
    }
};

function generateToken() {
    var length = 12,
        charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
        retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    return retVal;
}