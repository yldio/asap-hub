import aws from 'aws-sdk';
import { promises as fs } from 'fs';
import path from 'path';

import config from './webpack.config';

const ses = new aws.SES({ apiVersion: '2010-12-01' });
const syncTemplate = async (src: string): Promise<void> => {
  const template = require(src);
  const templateName = template.TemplateName;

  try {
    await ses
      .getTemplate({
        TemplateName: templateName,
      })
      .promise();

    await ses
      .updateTemplate({
        Template: template,
      })
      .promise();
    console.log(`Template "${templateName}" updated.`);
  } catch (err) {
    if (err.code === 'TemplateDoesNotExist') {
      await ses
        .createTemplate({
          Template: template,
        })
        .promise();
      console.log(`Template "${templateName}" created.`);
    }
    throw err;
  }
};

const syncTemplates = async () => {
  const outputDir = config.output?.path;
  if (!outputDir) {
    throw new Error('Failed to determine output dir');
  }
  const templates = (await fs.readdir(outputDir))
    .filter((file) => path.extname(file) === '.json')
    .map((file) => path.resolve(outputDir, file));

  const tasks = templates.map(syncTemplate);
  return Promise.all(tasks);
};

syncTemplates().catch((err) => {
  console.error(err);
  process.exit(1);
});
