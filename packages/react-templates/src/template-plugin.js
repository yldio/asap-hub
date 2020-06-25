const createCache = require('@emotion/cache').default;
const createEmotionServer = require('create-emotion-server').default;
const juice = require('juice');
const path = require('path');
const React = require('react');
const { CacheProvider } = require('@emotion/core');
const { promises: fs } = require('fs');
const { renderToStaticMarkup } = require('react-dom/server');
const { titleCase } = require('title-case');

const htmlTemplate = (
  content,
) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "https://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="https://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml"
    xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
    <!--[if gte mso 9]><xml>
<o:OfficeDocumentSettings>
<o:AllowPNG/>
<o:PixelsPerInch>96</o:PixelsPerInch>
</o:OfficeDocumentSettings>
</xml><![endif]-->
    <title>Christmas Email template</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0 ">
    <meta name="format-detection" content="telephone=no">
</head>
<body>
  ${content}
</body>
</html>`;

const apply = async (stats) => {
  const outputDir = stats.compilation.outputOptions.path;
  const files = await fs.readdir(outputDir);
  const tasks = files
    .filter((f) => f.endsWith('.js'))
    .map(async (f) => {
      try {
        const cache = createCache();
        const { extractCritical } = createEmotionServer(cache);
        const { default: Component, text } = require(path.resolve(
          outputDir,
          f,
        ));

        const element = React.createElement(
          CacheProvider,
          { value: cache },
          React.createElement(Component),
        );

        const { html, css } = extractCritical(renderToStaticMarkup(element));
        const s3Html = Object.keys(stats.compilation.assets).reduce(
          (html, asset) => {
            return html.replace(
              asset,
              `https://asap.yld.io/static/media/${asset}`,
            );
          },
          html,
        );

        const content = juice(`<style>${css}</style>${s3Html}`);
        const { name } = path.parse(f);
        await fs.writeFile(
          path.resolve(outputDir, `template-${name}.json`),
          JSON.stringify({
            TemplateName: titleCase(name),
            SubjectPart: titleCase(name),
            HtmlPart: htmlTemplate(content),
            TextPart: '',
          }),
        );
        return content;
      } catch (err) {
        console.error(err);
      }
    });

  return Promise.all(tasks);
};

module.exports = class TemplatePlugin {
  apply(compiler) {
    compiler.hooks.done.tapAsync('TemplatePlugin', async (stats, callback) => {
      return apply(stats)
        .then((res) => callback(null, res))
        .catch((err) => callback(err));
    });
  }
};
