const client = require("../../index");
const yaml = require('js-yaml');
const fs = require('fs');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2))

if (!config.LEVELS_SYSTEM.ENABLED) return
client.on('levelUp', async (message, data) => {
    message.channel.send(`${message.author}, has leveled up to level ${data.level}!`).then((msg) => {
      setTimeout(() => {
        msg.delete();
      }, 5000);
    });
  })