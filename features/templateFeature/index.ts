import type { Client } from 'discord.js';

const templateFeature = (bot: Client) => {
  if (!bot) throw new Error('Bot is not defined');
  console.log('hello from templateFeature');
  return true;
};

export default templateFeature;
