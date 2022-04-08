// Config
const fs = require('fs');
const yaml = require('js-yaml');
const config = yaml.load(fs.readFileSync('config/config.yml', 'utf8', 2));
if (!config.VERIFY_WEB_SYSTEM.ENABLED) return;

// Packages
const express = require('express');
const path = require('path');
const axios = require('axios');
const https = require('https');
const pool = require('./functions/captchaServer');

// Variables
const app = express();
const port = config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.HTTPS ? 443 : config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.WEB_PORT;

// Define render engine and assets path
app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, '/routes/assets')));
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/routes/html/invalidLink.html'));
});

// GET /verify/id
app.get('/verify/:verifyId?', (req, res) => {
    if (!req.params.verifyId) return res.sendFile(path.join(__dirname, '/routes/html/invalidLink.html'));
    if (!pool.isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, '/routes/html/invalidLink.html'));
    res.render(path.join(__dirname, '/routes/html/verify.html'), { publicKey: config.VERIFY_WEB_SYSTEM.RECAPTCHA.PUBLIC_KEY });
});

// POST /verify/id
app.post('/verify/:verifyId?', async (req, res) => {
    if (!req.body || !req.body['g-recaptcha-response']) return res.sendFile(path.join(__dirname, '/routes/html/invalidLink.html'));

    const response = await axios({
        method: 'post',
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${config.VERIFY_WEB_SYSTEM.RECAPTCHA.SECRET_KEY}&response=${req.body['g-recaptcha-response']}`,
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    if (!response.data.success) return res.sendFile(path.join(__dirname, '/routes/html/invalidCaptcha.html'));
    if (!pool.isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, '/routes/html/invalidLink.html'));
    pool.addRole(pool.getDiscordId(req.params.verifyId));
    pool.sendMessage(pool.getDiscordId(req.params.verifyId))
    pool.removeLink(req.params.verifyId);
    res.sendFile(path.join(__dirname, '/routes/html/valid.html'));
});

function main() {
    if (config.VERIFY_WEB_SYSTEM.WEB_SETTINGS.HTTPS) {
        https.createServer({
            key: fs.readFileSync('private.pem'),
            cert: fs.readFileSync('certificate.pem')
        }, app).listen(port, () => {
            console.log(` |- Verify Web System is listening on port ${port}`);
            console.log("-------------------------------------------------");
        });
    } else {
        app.listen(port, () => {
            console.log(` |- Verify Web System is listening on port ${port}`);
            console.log("-------------------------------------------------");
        });
    }
}

module.exports = {
    run: main
}