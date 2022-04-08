const client = require("../../index");

client.on("interactionCreate", async (interaction) => {
    // Slash Command Handling
    if (interaction.isCommand()) {
        const cmd = client.slashCommands.get(interaction.commandName);
        if (!cmd) return interaction.reply({ content: "An error has occured " });
        
        const blacklistSchema = client.database.blacklistDatabase;
        const blacklistData = await blacklistSchema.findOne({ guildID: interaction.guild.id });
        if (blacklistData) {
            if (blacklistData.memberID.includes(interaction.user.id)) {
                return interaction.reply({ content: "You are blacklisted from this server.", ephemeral: true });
            }
        };
        const args = [];

        for (let option of interaction.options.data) {
            if (option.type === "SUB_COMMAND") {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                });
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        if (!client.utils.isEnabled(client, interaction, cmd.permission)) return;
        if (!client.utils.checkPermission(client, interaction, cmd.permission)) return;

        cmd.run(client, interaction, args);
    }

    // Context Menu Handling
    if (interaction.isContextMenu()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.slashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
});