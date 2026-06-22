require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/kowtheslackbot-ping", async ({ ack, respond }) => {
  await ack();
  await respond({ text: "Pong!" });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();