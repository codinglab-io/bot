import type { SlashCommandBuilder } from '@discordjs/builders';
import { Routes } from 'discord-api-types/v9';
import { REST } from '@discordjs/rest';
import * as env from 'env-var';

const TOKEN = env.get('DISCORD_TOKEN').required().asString();
const CLIENTID = env.get('CLIENT_ID').required().asString();
const rest = new REST({ version: '9' }).setToken(TOKEN);

export const sendSlashCommands = async (commands: SlashCommandBuilder[]) => {
  if (commands.length === 0) return;

  const commandsJSON = commands.map((command) => command.toJSON());

  try {
    await rest.put(Routes.applicationCommands(CLIENTID), {
      body: commandsJSON,
    });
    console.log(
      `Successfully registered ${commands.length} application commands.`
    );
  } catch (error) {
    console.log(error);
  }
};
