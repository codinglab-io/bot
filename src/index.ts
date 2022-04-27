import { Client, Intents } from 'discord.js';
import * as env from 'env-var';
import { loadFeatures } from './featureLoader';

const TOKEN = env.get('DISCORD_TOKEN').required().asString();

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.once('ready', async () => {
  console.log(`Logged in as ${bot.user?.tag ?? 'unknown'}!`);
  const status = await loadFeatures(bot);
  console.log(`Loaded ${status.length} features.`);
});

bot.login(TOKEN);
