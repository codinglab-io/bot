import type { Client } from 'discord.js';
import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';
import type { SlashCommandBuilder } from '@discordjs/builders';

const rootFeatureFolder = join(__dirname, '/features');
const commandsFileName = 'commands';

const loadFeatures = async (bot: Client) => {
  if (!bot) throw new Error('Bot is not defined');

  const featurePaths = await readdir(rootFeatureFolder);
  const commandsToSend: SlashCommandBuilder[] = [];

  const features = featurePaths.map(async (featureName) => {
    const fullPath = join(rootFeatureFolder, featureName);
    if (!(await stat(fullPath)).isDirectory()) {
      console.log(`${fullPath} is not a directory. Ignoring.`);
      return;
    }

    console.log(`Loading feature ${featureName}`);
    const { default: feature } = await import(resolve(fullPath));
    const { default: commands } = await import(
      resolve(join(fullPath, commandsFileName))
    );

    commandsToSend.push(...commands);

    return feature(bot);
  });

  const status = await Promise.all(features);

  return status;
};

export { loadFeatures };
