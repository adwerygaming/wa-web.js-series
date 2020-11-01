const fs = require('fs');
const { Client, Location } = require('whatsapp-web.js');

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });
// You can use an existing session and avoid scanning a QR code by adding a "session" object to the client options.
// This object must include WABrowserId, WASecretBundle, WAToken1 and WAToken2.

client.on('qr', (qr) => {
    // NOTE: This event will not be fired if a session is specified.
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
    console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', msg => {
    // Fired if session restore was unsuccessfull
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
});

client.on("message", async msg => {
    let chat = await msg.getChat();
    if (msg.body == "Halo") {
        msg.reply("Yo gan")
    } else if (msg.body == "file") {
        const { MessageMedia } = require('whatsapp-web.js');

const media = MessageMedia.fromFilePath('file-yang-akan-dikirim.txt');
chat.sendMessage(media, { caption: "Ini gan."})
    }
})
client.initialize();
