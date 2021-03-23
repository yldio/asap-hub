import path from 'path';
import webpack, { Configuration, Stats } from 'webpack';
import { promises as fs } from 'fs';

import webpackConfig from './webpack.config';
import syncTemplate from './sync-template';

// required by babel-preset-react-app
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
const compile = (config: Configuration): Promise<Stats | undefined> => {
  const compiler = webpack(config);
  return new Promise((resolve, reject) => {
    compiler.run((err, res) => {
      if (err) {
        return reject(err);
      }
      return resolve(res);
    });
  });
};

const syncTemplates = async (templates: string[]) => {
  const tasks = templates.map(syncTemplate);
  return Promise.all(tasks);
};

const main = async () => {
  const templatesDir = path.resolve(__dirname, 'templates');
  const templates = await fs.readdir(templatesDir);
  const res = await compile({
    entry: templates.reduce((entries, template) => {
      const { name } = path.parse(template);
      return {
        ...entries,
        [name]: path.resolve(templatesDir, template),
      };
    }, {}),
    ...webpackConfig,
  });
  if (!res) {
    throw new Error('Missing webpack compilation stats');
  }
  const outputPath = res.compilation.outputOptions.path;
  if (!outputPath) {
    throw new Error('Cannot determine output dir');
  }

  const files = await fs.readdir(outputPath);
  const templatesJson = files
    .filter((f) => f.endsWith('.json'))
    .map((f) => path.resolve(outputPath, f));
  await syncTemplates(templatesJson);
};

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
