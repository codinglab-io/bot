import type { DMChannel, NonThreadGuildBasedChannel } from 'discord.js';
import { getRootChannelId, setRootChannelId, voiceChannels } from '../index';

export default async (channel: DMChannel | NonThreadGuildBasedChannel) => {
  if (channel.type !== 'GUILD_VOICE') return;
  if (channel.id === getRootChannelId()) {
    setRootChannelId('');
  }

  console.log('Event channelDelete : ', channel.name);
  const indexChannel = voiceChannels.findIndex(
    (voiceChannel) => voiceChannel.id === channel.id
  );
  if (indexChannel > -1) voiceChannels.splice(indexChannel, 1);
};
