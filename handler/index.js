const { glob } = require("glob");
const { promisify } = require("util");
const mongoose = require("mongoose");
const globPromise = promisify(glob);
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

module.exports = async (client) => {
    console.log("---------------> Loading Handler <---------------");
    // Commands
   const commandFiles = await globPromise(`${process.cwd()}/commands/**/*.js`);
   commandFiles.map((value) => {
       const file = require(value);
       const splitted = value.split("/");
       const directory = splitted[splitted.length - 2];
       
       if (file.name) {
           const properties = { directory, ...file };
           client.commands.set(file.name, properties);
        }
    });
    console.log(" |- Loaded \x1b[32m" + client.commands.size + "\x1b[0m commands.");
    
    // Events
    const eventFiles = await globPromise(`${process.cwd()}/events/**/*.js`);
    eventFiles.map((value) => require(value));
    console.log(" |- Loaded \x1b[32m" + eventFiles.length + "\x1b[0m events.");

    // Slash Commands
    const slashCommands = await globPromise(`${process.cwd()}/SlashCommands/*/*.js`);

    const arrayOfSlashCommands = [];
    slashCommands.map((value) => {
        const file = require(value);
        if (!file?.name) return;
        client.slashCommands.set(file.name, file);

        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file);
    });
    console.log(" |- Loaded \x1b[32m" + client.slashCommands.size + "\x1b[0m slash commands.");

    // Register Slash Commands
    client.on("ready", async () => {
        const guild = client.guilds.cache.get(client.config.GUILD_ID);
        await guild.commands.set(arrayOfSlashCommands);
    });
    await wait(3000);
    // Mongoose Config
    const { MONGO_URI } = client.config;
    if (!MONGO_URI) {
        console.log(" ")
        console.log(" |- Mongoose is not configured...");
        console.log("-------------------------------------------------");
        process.exit(1);
    }
    await mongoose.connect(MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }).then(() => {
        console.log(" |- Successfully connected to MongoDB.");
        console.log(" |- Logged in as " + client.user.tag);
    }).catch(console.error);
    if (client.config.VERIFY_WEB_SYSTEM.ENABLED) {
        const webserver = require('../server');
        webserver.run();
    } else {
        console.log("-------------------------------------------------");
    }
};
