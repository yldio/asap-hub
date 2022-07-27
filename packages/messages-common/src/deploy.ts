import aws, { AWSError } from 'aws-sdk';
import { promises as fs } from 'fs';
import path from 'path';
import { Configuration } from 'webpack';

const region = process.argv[2] || 'us-east-1';
const ses = new aws.SES({ apiVersion: '2010-12-01', region });

const isAwsError = (error: unknown): error is AWSError =>
  !!(error as AWSError)?.code;

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
    if (isAwsError(err) && err.code === 'TemplateDoesNotExist') {
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

export const syncTemplates = async (config: Configuration) => {
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
