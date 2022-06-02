import { SlashCommandBuilder } from '@discordjs/builders';

export default [
  new SlashCommandBuilder()
    .setName('createrootchannel')
    .setDescription('Create the root channel!')
    .addStringOption((option) =>
      option
        .setName('name')
        .setDescription('Name of the root channel')
        .setRequired(true)
    )
    .addChannelOption((option) =>
      option
        .setName('destination')
        .setDescription('Select a channel destination')
    ),
];
