import { Client, Intents } from 'discord.js';
import * as env from 'env-var';

const TOKEN = env.get('DISCORD_TOKEN').required().asString();

const bot = new Client({ intents: [Intents.FLAGS.GUILDS] });

bot.once('ready', () => console.log('Ready!'));
bot.login(TOKEN);
