import type {
  CacheType,
  Client,
  GuildChannelManager,
  Interaction,
} from 'discord.js';
import { getVoiceConnection } from '@discordjs/voice';
import { getRootChannelId, setRootChannelId } from '..';

const getCustomVoiceChannels = (client: Client) => {
  const channels = client.channels.cache.filter((channel) => {
    return channel.type === 'GUILD_VOICE' && channel.name.includes('@CL');
  });

  return channels;
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

export default async (bot: Client, interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

  if (commandName === 'disconnect') {
    const connection = getVoiceConnection(
      interaction.guild ? interaction.guild.id : ''
    );
    if (connection) connection.destroy();
    await interaction.reply({ content: `Disconnected!`, ephemeral: true });
    return;
  }

  if (commandName === 'clean') {
    const channels = getCustomVoiceChannels(bot);
    const promises: any[] = channels.map((channel) => channel.delete());

    await Promise.all(promises);
    await interaction.reply({
      content: `Cleaned successfully!`,
      ephemeral: true,
    });

    return;
  }

  if (commandName === 'createrootchannel') {
    const rootChannelId = getRootChannelId();
    if (rootChannelId) {
      await interaction.reply({
        content: `An root channel already exist!`,
        ephemeral: true,
      });
      return;
    }

    const channelManager = interaction.guild?.channels;
    if (!channelManager) return;

    const nameChannel = interaction.options.getString('name');
    const channelDestination = interaction.options.getChannel('destination');

    const channel = await createVoiceChannel(
      channelManager,
      `@CL ${nameChannel}`,
      channelDestination?.id
    );

    if (channel) {
      setRootChannelId(channel.id);
      await interaction.reply({
        content: `Created root channel ${channel.name}!`,
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: `Error when creating the root channel`,
        ephemeral: true,
      });
    }
  }
};
