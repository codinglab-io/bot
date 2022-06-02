import type { Client } from 'discord.js';
import { readdir, stat } from 'fs/promises';
import { join, resolve } from 'path';

const rootFeatureFolder = join(__dirname, './features');

const loadFeatures = async (bot: Client) => {
  if (!bot) throw new Error('Bot is not defined');

  const featurePaths = await readdir(rootFeatureFolder);

  const features = featurePaths.map(async (featureName) => {
    const fullPath = join(rootFeatureFolder, featureName);
    if (!(await stat(fullPath)).isDirectory()) {
      console.log(`${fullPath} is not a directory. Ignoring.`);
      return;
    }

    console.log(`Loading feature ${featureName}`);
    const { default: feature } = await import(resolve(fullPath));
    return feature(bot);
  });

  return Promise.all(features);
};

export { loadFeatures };
