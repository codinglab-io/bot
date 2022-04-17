import { Client, Intents } from "discord.js";
import * as env from "env-var";

const main = async () => {
  const TOKEN = env.get("DISCORD_TOKEN").required().asString();

  const bot = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] });

  bot.once("ready", () => console.log("Ready!"));

  await bot.login(TOKEN);
};

void main();
