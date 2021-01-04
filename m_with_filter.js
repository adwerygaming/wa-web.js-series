const fs = require('fs');
const { Client, Location, MessageMedia } = require('whatsapp-web.js');
const prefix = "dp!"
const exec = require("child_process").exec; //new

const SESSION_FILE_PATH = './session.json';
let sessionCfg;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionCfg = require(SESSION_FILE_PATH);
}

const client = new Client({ puppeteer: { headless: true }, session: sessionCfg });

client.on('qr', (qr) => {
    console.log('QR RECEIVED', qr);
});

client.on('authenticated', (session) => {
    //console.log('AUTHENTICATED', session);
    sessionCfg=session;
    fs.writeFile(SESSION_FILE_PATH, JSON.stringify(session), function (err) {
        if (err) {
            console.error(err);
        }
    });
});

client.on('auth_failure', msg => {
    console.error('AUTHENTICATION FAILURE', msg);
});

client.on('ready', () => {
    console.log('READY');
    //STATUS BERGANTI SETIAP 15 DETIK

    //KODE ADA DI DESKRIPSI
    const status_text = [
        "This Account Controlled By Script, Whooho!",
        "Harta Tahta ${contact.author}",
        "Test Bot gan. DM Saya Ketik !kucing.",
        "Beep Boop Beep Boop Calon Mantu :v",
        "Created Using whasab js",
        "Subscribe LQLoL GT!",
        "I lope u"
      ]; //BISA DIUBAH SEMAU MUNGKIN DAN SEBANYAK MUNGKIN
    
      const emojis = ["🧡", "💞", "👨", "🎇"];
      //JIKA TIDAK MAU PAKE EMOJI JUGA GAK PAPA
    
      const index = Math.floor(Math.random() * (status_text.length - 1) + 1);
      const index2 = Math.floor(Math.random() * (emojis.length - 1) + 1);
      //YANG BIKIN RANDOM!
    
      client.setStatus(`This Account Has Been Controled By Script.`);
    
      setInterval(() => {
        const index = Math.floor(Math.random() * (status_text.length - 1) + 1);
        const index2 = Math.floor(Math.random() * (emojis.length - 1) + 1);
    
        client.setStatus(
          `${emojis[index2]} ${status_text[index]} ${emojis[index2]}`
        ); //EMOJI STATUS_TEXT EMOJI
      }, 10000);

});

client.on("message", async msg => {
    let chat = await msg.getChat();
    const text = msg.body

    if (msg.body == "Halo") {
        msg.reply("Yo gan")
    } else if (msg.body == "file") {
        const media = MessageMedia.fromFilePath('file-yang-akan-dikirim.txt');
        chat.sendMessage(media, { caption: "Ini gan."})
    } else if (text.includes(prefix+"yt")) {
        //YOUTUBE CONVERTER
        const url = text.replace(/!yt/, "");
  
        var videoid = url.match(
          /(?:https?:\/{2})?(?:w{3}\.)?youtu(?:be)?\.(?:com|be)(?:\/watch\?v=|\/)([^\s&]+)/
        );

      const ytdl = require("ytdl-core"); //ytdl code dibutuhkan
      if (videoid != null) {
        console.log("video id = ", videoid[1]);
        msg.reply(`Video ID : ${videoid[1]}.`);
      } else {
        msg.reply("[ERROR] *Linknya Gak Valid Bro.*");
      }
      ytdl.getInfo(videoid[1]).then(info => {
        if (info.length_seconds > 1000) {
          msg.reply(
            "[ERROR] *Durasi Videonya Kepanjangan Bro. Max 15 Menit.*"
          );
        } else {
          console.log(info.length_seconds);
          msg.reply(
            "Link Diterima! Mohon Tunggu Beberapa Menit. <3"
          );
          msg.reply("Video Sedang Di Process..");

          function os_func() {
            this.execCommand = function(cmd) {
              return new Promise((resolve, reject) => {
                exec(cmd, (error, stdout, stderr) => {
                  if (error) {
                    reject(error);
                    return;
                  }
                  resolve(stdout);
                });
              });
            };
          }
          var os = new os_func();

          const filetitle = videoid[1];
          os.execCommand(
            `youtube-dl -x --audio-format mp3 --output ` +
              filetitle +
              ".%(ext)s'" +
              ` https://www.youtube.com/watch?v=` +
              videoid[1]
          )
            .then(res => {
              const buffer = fs.readFileSync(filetitle + ".mp3");
              const media = MessageMedia.fromFilePath(`${filetitle}.mp3`);
              msg.reply("Video Sudah Selesai. Sedang Mengirim....");
              chat.sendMessage(media);
            })
            .catch(err => {
              console.log("os >>>", err);
              msg.reply(`[FATAL ERROR] *${err}*`);
            });
        }
      });
    } else if (msg.body === prefix+"sticker") {
      const media = MessageMedia.fromFilePath("./unnamed.png")
      client.sendMessage(msg.from, media, { sendMediaAsSticker: true}) //penting
    } else if (msg.body.includes(prefix+"play")) {
      const ytSearch = require("yt-search")
      const ytdl = require("ytdl-core")
      const respon = msg.body.replace(prefix+"play ", "")

      function os_func() {
        this.execCommand = function(cmd) {
          return new Promise((resolve, reject) => {
            exec(cmd, (error, stdout, stderr) => { //penambahaan package child_process. no instal req. 
              if (error) {
                reject(error);
                return;
              }
              resolve(stdout);
            });
          });
        };
      }
      var os = new os_func();
      //kode untuk menjalankan youtube-dl nanti tahun depan

      const SearchVideo = async (title) => {
        const hasil = await ytSearch(title)
        return (hasil.videos.length > 1) ? hasil.videos[1] : null; //fix typr, dari video ke videos
      }

      const video = await SearchVideo(respon) //mencari video dari respon
      console.log(video)

      //fun part begin
      const link = video.url
      const title = video.title
      const id = video.videoId
      const time = video.duration.seconds
      const filetitle = `${id}`//fix type, menghulangkan .mp3

      if (duration_secs > 180) {
        console.log(`Durasi Lebih Dari 3 Menit!`)
        os.execCommand(`youtube-dl -x --audio-format mp3 --postprocessor-args "-ss 00:00:00.00 -t 00:03:00.00" --output ./files/plays/` +
          filetitle +
          ".%(ext)s'" +
          ` https://www.youtube.com/watch?v=` +
          id).then(res => {
          const media = MessageMedia.fromFilePath(`./files/yt/${id}.mp3`)
          msg.reply(media)
          console.log(`Task Done!`)
        })
      } else {
        //perintah terjalankan apabila detik dari video itu kurang dari 180.

        //menjalankan perintah youtube-dl
        console.log("Downloading...")
        os.execCommand(`youtube-dl -x --audio-format mp3 --output ./files/yt/` +
          filetitle +
          ".%(ext)s'" +
          ` https://www.youtube.com/watch?v=` +
          id).then(res => {
          console.log(res)
          console.log("Download Done!")
          const media = MessageMedia.fromFilePath(`./files/yt/${filetitle}.mp3`) //penambahkan .mp3
          msg.reply(media)
          console.log("Task Complete!")
        })
      }
      }
})

client.initialize();












