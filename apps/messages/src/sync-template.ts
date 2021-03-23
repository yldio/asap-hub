import aws from 'aws-sdk';

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

export default syncTemplate;
