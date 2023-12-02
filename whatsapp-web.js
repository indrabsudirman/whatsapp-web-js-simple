const qrcode = require("qrcode-terminal");

const { Client, LocalAuth } = require("whatsapp-web.js");
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    headless: false,
  },
});

client.initialize();

client.on("qr", (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on("loading_screen", (percent, message) => {
  console.log("Loading Screen", percent, message);
});

client.on("authenticated", () => {
  console.log("AUTHENTICATED!");
});

client.on("auth_failure", (msg) => {
  //fired if session restore was unsuccessful
  console.error("AUTHENTICATED FAILURE", msg);
});

//If success authenticated
client.on("ready", () => {
  console.log("Client is ready!");
});

//Read the message
client.on("message", async (msg) => {
  const { body } = msg;
  console.log("MESSAGE RECEIVED :", body);

  const contact = await msg.getContact();
  const name = contact.pushname;
  console.log(name);

  switch (body) {
    case "1":
      msg.reply(
        `Untuk pesan makan, isi data ini ya ka:\n- Jenis Makanan: ...\n- Quantity: ...\n- Ambil sendiri atau dianter: (Ya/Tidak)`
      );
      break;
    case "2":
      msg.reply(
        `Untuk pesan minum, isi data ini ya ka:\n- Jenis Minuman: ...\n- Quantity: ...\n- Ambil sendiri atau dianter: (Ya/Tidak)`
      );
      break;
    case "3":
      msg.reply(
        `Oh, mau ngomong yang lain ya, oke siap ka 🫡.\nNanti saya balas ya. Mohon maaf lagi slow response ini ka ${name} 🙏`
      );
      break;
    default:
      client.sendMessage(
        msg.from,
        `hi ${name}, terima kasih sudah wa. Tolong balas dengan angka berikut ini ya :\n1 Pesan Makan\n2 Pesan Minum\n3 Lainnya\nTerima kasih ka ${name} 🙏`
      );
  }
});
