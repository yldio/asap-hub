import { SES, TemplateDoesNotExistException } from '@aws-sdk/client-ses';
import { promises as fs } from 'fs';
import path from 'path';
import { Configuration } from 'webpack';

const region = process.argv[2] || 'us-east-1';
const ses = new SES({ apiVersion: '2010-12-01', region });

const syncTemplate = async (src: string): Promise<void> => {
  const template = require(src);
  const templateName = template.TemplateName;

  try {
    await ses.getTemplate({
      TemplateName: templateName,
    });

    await ses.updateTemplate({
      Template: template,
    });
    console.log(`Template "${templateName}" updated.`);
  } catch (err) {
    if (err instanceof TemplateDoesNotExistException) {
      await ses.createTemplate({
        Template: template,
      });
      console.log(`Template "${templateName}" created.`);
    }
    throw err;
  }
};

export const syncTemplates = async (config: Configuration): Promise<void[]> => {
  const outputDir = config.output?.path;
  if (!outputDir) {
    throw new Error('Failed to determine output dir');
  }
  const templates = (await fs.readdir(outputDir))
    .filter((file) => path.extname(file) === '.json')
    .map((file) => path.resolve(outputDir, file));

  console.log(`Using region ${region}`);
  console.log('Available templates:', templates);
  if (!templates.length) {
    process.exit(1);
  }

  const tasks = templates.map(syncTemplate);
  return Promise.all(tasks);
};
