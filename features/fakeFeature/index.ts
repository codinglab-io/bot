import type { Client } from 'discord.js';

const fakeFeature = (bot: Client) => {
  if (!bot) throw new Error('Bot is not defined');
  console.log('hello from fakeFeature');
  return true;
};

export default fakeFeature;
