import type {
  CacheType,
  Interaction,
} from 'discord.js';
import { createVoiceChannel, getRootChannelId, prefixChannel, setRootChannelId } from '..';

export default async (interaction: Interaction<CacheType>) => {
  if (!interaction.isCommand()) return;

  const { commandName } = interaction;

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
      `${prefixChannel} ${nameChannel}`,
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
