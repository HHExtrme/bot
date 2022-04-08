const { 
    Client, 
    CommandInteraction,
    MessageAttachment
} = require("discord.js");

const Canvas = require('canvas');
const path = require('path')

Canvas.registerFont( path.join(__dirname, '..', '..', 'assets', 'alba.TTF'), { family: 'Alba' });

const applyText = (canvas, text, size, font) => {
    const context = canvas.getContext('2d');

    do {
        context.font = `${size -= 10}px "${font}"`;
    } while (context.measureText(text).width > canvas.width - 300);

    return context.font;
};


module.exports = {
    name: "joinmessage",
    permission: "JOIN_MESSAGE",
    description: "Send the join message.",
    type: 'CHAT_INPUT',
    options: [],
    /**
     *
     * @param {Client} client
     * @param {CommandInteraction} interaction
     * @param {String[]} args
     */
    run: async (client, interaction, args) => {
        const canvas = Canvas.createCanvas(700, 250);
        const context = canvas.getContext('2d');

        const background = await Canvas.loadImage(path.join(__dirname, '..', '..', 'assets', 'joinmessage.jpg'));
        context.drawImage(background, 0, 0, canvas.width, canvas.height);

        context.strokeStyle = '#0099ff';
        context.strokeRect(0, 0, canvas.width, canvas.height);

      //  context.font = '28px sans-serif';
      //  context.fillStyle = '#ffffff';
       // context.fillText('Profile', canvas.width / 2.5, canvas.height / 3.5);

        const welcomeMessage = `Welcome ${interaction.member.displayName} to ${interaction.guild.name}!`

        context.shadowColor = "black";
        context.shadowBlur = 7;
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.font = applyText(canvas, welcomeMessage, 30, "Alba");
        context.fillStyle = '#ffffff';
        context.fillText(welcomeMessage, canvas.width / 2.6, canvas.height / 2.3);

        console.log(interaction.guild.members.size)
        const memberCount = "You are the member #"+interaction.guild.members.size+"!"

        context.shadowColor = "black";
        context.shadowBlur = 7;
        context.shadowOffsetX = 3;
        context.shadowOffsetY = 3;
        context.font = applyText(canvas, memberCount, 35, "Alba");
        context.fillStyle = '#ffffff';
        context.fillText(memberCount, canvas.width / 2.6, canvas.height / 1.7);

        context.beginPath();
        context.arc(155, 125, 60, 0, Math.PI * 2, true);
        context.closePath();
        context.clip();

        const avatar = await Canvas.loadImage(interaction.user.displayAvatarURL({ format: 'jpg' }));
        context.drawImage(avatar, 94, 64, 122, 122);

        const attachment = new MessageAttachment(canvas.toBuffer(), 'profile-image.png');

        interaction.reply({ files: [attachment] });
    },
};