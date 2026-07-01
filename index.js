require("dotenv").config();

const { App } = require("@slack/bolt");
const axios = require("axios");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/zeno-bot-fact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a fact." });
  }
});

app.command("/zeno-bot-roll", async ({ ack, command, respond }) => {
  await ack();

  let sides = parseInt(command.text.trim());

  if (isNaN(sides) || sides < 2) sides = 6;

  const result = Math.floor(Math.random() * sides) + 1;

  await respond({
    text: `You rolled a **${result}** on a ${sides}-sided dice!`
  });
});

app.command("/zeno-bot-book", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await axios.get(
      "https://openlibrary.org/search.json?q=bestseller&limit=20"
    );

    const books = res.data.docs;
    const book = books[Math.floor(Math.random() * books.length)];

    await respond({
      text: `*${book.title}*\nAuthor: ${book.author_name ? book.author_name[0] : "Unknown"}`
    });

  } catch (err) {
    await respond({
      text: "Couldn't fetch a book recommendation."
    });
  }
});

app.command("/zeno-bot-duck", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await axios.get("https://random-d.uk/api/random");

    await respond({
      text: "🦆 Here's a random duck!",
      blocks: [
        {
          type: "image",
          image_url: res.data.url,
          alt_text: "Duck"
        }
      ]
    });

  } catch (err) {
    await respond({
      text: "Couldn't fetch a duck."
    });
  }
});

app.command("/zeno-bot-study", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await axios.get("https://api.adviceslip.com/advice");

    await respond({
      text: `Study Tip\n\n${res.data.slip.advice}`
    });

  } catch (err) {
    await respond({
      text: "Couldn't fetch a study tip."
    });
  }
});

app.command("/zeno-bot-aura", async ({ ack, respond }) => {
  await ack();

  const score = Math.floor(Math.random() * 101);

  let aura;

  if (score >= 90)
    aura = "👑 Legendary Aura";
  else if (score >= 75)
    aura = "✨ Elite Aura";
  else if (score >= 60)
    aura = "😎 Strong Aura";
  else if (score >= 40)
    aura = "🙂 Average Aura";
  else if (score >= 20)
    aura = "🤨 Weak Aura";
  else
    aura = "💀 Negative Aura";

  await respond({
    text: `✨ Aura Score: *${score}/100*\n${aura}`
  });
});

app.command("/zeno-bot-news", async ({ ack, respond }) => {
  await ack();

  try {
    const res = await axios.get(
      `https://gnews.io/api/v4/top-headlines?category=general&lang=en&max=1&apikey=${process.env.NEWS_API_KEY}`
    );

    const article = res.data.articles[0];

    await respond({
      text:
`📰 *${article.title}*

${article.description}

🔗 ${article.url}`
    });

  } catch (err) {
    console.error(err);

    await respond({
      text: "Couldn't fetch the latest news."
    });
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
/zeno-bot-define <word> - Get the meaning of a word
/zeno-bot-image - Get a random image
/zeno-bot-roll <number> - Roll a dice
/zeno-bot-book - Get a book recommendation
/zeno-bot-duck - Get a random duck image
/zeno-bot-study - Get a study tip
/zeno-bot-aura - Check your aura score
/zeno-bot-news - Get the latest world news
/zeno-bot-ping - Check bot latency`
  });
});

app.command("/zeno-bot-define", async ({ ack, command, respond }) => {
  await ack();

  const word = command.text?.trim();

  if (!word) {
    return await respond({
      text: "Usage: /zeno-bot-define <word>"
    });
  }

  try {
    const res = await axios.get(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    const meaning =
      res.data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition;

    await respond({
      text: `📖 *${word}*\nMeaning: ${meaning}`
    });

  } catch (err) {
    await respond({
      text: `No definition found for "${word}".`
    });
  }
});

app.command("/zeno-bot-ping", async ({ ack, respond }) => {
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
      text: `😂 ${response.data.setup}\n\n${response.data.punchline}`
    });

  } catch (err) {
    await respond({
      text: "Failed to fetch a joke."
    });
  }
});

app.command("/zeno-bot-image", async ({ ack, respond }) => {
  await ack();

  const imageUrl = "https://source.unsplash.com/random/?space,art,nature";

  await respond({
    text: "🌌 Random image",
    blocks: [
      {
        type: "image",
        image_url: imageUrl,
        alt_text: "random image"
      }
    ]
  });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();