import { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import * as env from 'env-var';

const TOKEN = env.get('DISCORD_TOKEN').required().asString();
const CLIENTID = env.get('CLIENTID').required().asString();
const GUILDID = env.get('GUILDID').required().asString();


const commands = [
    new SlashCommandBuilder().setName('createrootchannel')
    .setDescription('Create the root channel!')
    .addStringOption(option =>
        option.setName('name')
            .setDescription('Name of the root channel')
            .setRequired(true))
    .addChannelOption(option => option.setName('destination').setDescription('Select a channel destination')),
    new SlashCommandBuilder().setName('changevoicemode')
    .setDescription('Change the mode of the current channel voice!')
    .addStringOption(option =>
        option.setName('mode')
            .setDescription('Select the mode')
            .setRequired(true)
            .addChoice('Pomodoro', 'pomodoro')
            .addChoice('Muted', 'muted')
            .addChoice('Debate', 'debate'))

]
.map(command => command.toJSON());

const rest = new REST({ version: '9' }).setToken(TOKEN);

rest.put(Routes.applicationGuildCommands(CLIENTID, GUILDID), { body: commands })
    .then(() => console.log('Successfully registered application commands.'))
    .catch(console.error);