import type { Client, GuildChannelManager, VoiceState } from 'discord.js';
import { getRootChannelId, voiceChannels } from '..';

const getConnectedMembersCount = (client: Client, channelId: string) => {
  const channel = client.channels.cache.get(channelId);

  if (channel && channel.type === 'GUILD_VOICE') {
    return channel.members.size;
  }

  return -1;
};

const isUserTheOwner = (userId: string, channelId: string) => {
  const isOwner =
    voiceChannels.findIndex(
      (voiceChannel) =>
        voiceChannel.ownerId === userId && voiceChannel.id === channelId
    ) > -1;

  if (isOwner) return true;
  return false;
};

const createVoiceChannel = async (
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

const getLastChannelPosition = () => {
  if (voiceChannels.length > 0) {
    const lastPosition =
      voiceChannels[voiceChannels.length - 1]?.position || '0';
    return parseInt(lastPosition) + 1;
  }

  return 0;
};

const deleteChannelsIfNeeded = async (
  client: Client,
  oldChannelId: string,
  newChannelId: string,
  userId: string
) => {
  if (newChannelId !== oldChannelId) {
    const connectedMembers = getConnectedMembersCount(client, oldChannelId);

    if (connectedMembers === 0 && isUserTheOwner(userId, oldChannelId)) {
      const channel = client.channels.cache.get(oldChannelId);
      try {
        if (channel) await channel.delete();
      } catch (error) {
        console.log('Error deleting channel: ', error);
      }
    } else if (connectedMembers === 0) {
      // Maybe delete the voice channel after X seconds?
    }
  }
};

const isCustomChannel = (channelId: string) => {
  const index = voiceChannels.findIndex(
    (voiceChannel) => voiceChannel.id === channelId
  );
  if (index > -1) return true;
  return false;
};

export default async (
  bot: Client,
  oldUserState: VoiceState,
  newUserState: VoiceState
) => {
  const guildChannelManager = newUserState.guild.channels;

  const oldChannelId = oldUserState.channelId || '';
  const newChannelId = newUserState.channelId || '';
  const userId = newUserState.id;

  const rootChannelId = getRootChannelId();
  // channelCreation
  if (rootChannelId && rootChannelId === newChannelId) {
    const parentId = newUserState.channel?.parentId || '';
    const position = getLastChannelPosition();
    const nameChannel = '@CL-Channel #' + position;

    const channel = await createVoiceChannel(
      guildChannelManager,
      nameChannel,
      parentId
    );
    if (channel) {
      voiceChannels.push({
        id: channel.id,
        position: position.toString(),
        name: nameChannel,
        ownerId: userId,
      });

      console.log('Just created channel');
      newUserState.setChannel(channel);
    } else {
      console.log('Error when creating channel');
    }
  }

  console.log(
    `moved from ${oldUserState.channel?.name} to ${newUserState.channel?.name}`
  );

  if (!isCustomChannel(oldChannelId)) return;
  // same channel so we dont care because it can be just a user mic change
  if (oldChannelId === newChannelId) return;

  deleteChannelsIfNeeded(bot, oldChannelId, newChannelId, userId);
};
