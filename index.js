require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

const axios = require("axios");
app.command("/zeno-bot-fact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a fact." });
  }
});

app.command("/zeno-bot-help", async ({ ack, respond }) => {
  await ack();

  await respond({
    text:
`Available Commands:

/zeno-bot-help - Show commands
/zeno-bot-fact - Get a random fact
/zeno-bot-joke - Get a random joke
/zeno-bot-image - Get a random image`
  });
});

app.command("/zeno-bot-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

app.command("/zeno-bot-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(
      "https://official-joke-api.appspot.com/random_joke"
    );

    await respond({
      text:
`😂 ${response.data.setup}

${response.data.punchline}`
    });

  } catch (err) {
    console.error(err);

    await respond({
      text: "Failed to fetch a joke."
    });
  }
});

app.command("/zeno-bot-image", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get(
      "https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"
    );

    await respond({
      text: `🌌 ${response.data.title}`,
      blocks: [
        {
          type: "image",
          image_url: response.data.url,
          alt_text: response.data.title
        }
      ]
    });

  } catch (err) {
    console.error(err);

    await respond({
      text: "Failed to fetch a space image."
    });
  }
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();