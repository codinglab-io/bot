import type { Client, GuildChannelManager } from 'discord.js';
import type { VoiceChannelCustom } from './interfaces/VoiceChannelCustom';
import voiceStateUpdate from './events/voiceStateUpdate';
import interactionCreate from './events/interactionCreate';
import channelDelete from './events/channelDelete';

let rootChannelId: string = '';

export const voiceChannels: VoiceChannelCustom[] = [];
export const prefixChannel = '@CL';
export const createVoiceChannel = async (
  channelManager: GuildChannelManager,
  channelName: string,
  parentId?: string
) => {
  try {
    const channel = await channelManager.create(channelName, {
      type: 'GUILD_VOICE',
      ...(parentId && { parent: parentId }),
    });
    return channel;
  } catch (error) {
    console.log('Error creating channel: ', error);
    return null;
  }
};

export const setRootChannelId = (id: string) => {
  rootChannelId = id;
};
export const getRootChannelId = () => {
  return rootChannelId;
};

const voiceOnDemand = async (bot: Client) => {
  if (!bot) throw new Error('Bot is not defined');

  bot.on('voiceStateUpdate', async (oldUserState, newUserState) =>
    voiceStateUpdate(bot, oldUserState, newUserState)
  );

  bot.on('interactionCreate', async (interaction) =>
    interactionCreate(interaction)
  );

  bot.on('channelDelete', async (channel) => channelDelete(channel));

  return true;
};

export default voiceOnDemand;
