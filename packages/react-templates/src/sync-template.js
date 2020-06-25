const AWS = require('aws-sdk');

const ses = new AWS.SES({ apiVersion: '2010-12-01' });
module.exports = async (src) => {
  const template = require(src);
  const templateName = template.TemplateName;

  try {
    await ses
      .getTemplate({
        TemplateName: templateName,
      })
      .promise();
    return ses
      .updateTemplate({
        Template: template,
      })
      .promise();
  } catch (err) {
    if (err.code === 'TemplateDoesNotExist') {
      return ses
        .createTemplate({
          Template: template,
        })
        .promise();
    }
    throw err;
  }
};
