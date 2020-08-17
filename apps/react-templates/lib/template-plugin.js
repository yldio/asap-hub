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
  title,
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
    <title>${title}</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0 ">
    <meta name="format-detection" content="telephone=no">
</head>
<body>
  ${content}
</body>
</html>`;

const apply = async (stats, origin) => {
  const outputDir = stats.compilation.outputOptions.path;
  const files = await fs.readdir(outputDir);
  const tasks = files
    .filter((f) => f.endsWith('.js'))
    .map(async (f) => {
      const cache = createCache();
      const { extractCritical } = createEmotionServer(cache);
      const pkg = require(path.resolve(outputDir, f));
      const Component = pkg.default;

      const { name } = path.parse(f);
      const subject = pkg.subject ? pkg.subject : titleCase(name);

      const element = React.createElement(
        CacheProvider,
        { value: cache },
        React.createElement(Component),
      );

      const { html, css } = extractCritical(renderToStaticMarkup(element));
      const s3Html = Object.keys(stats.compilation.assets).reduce(
        (res, asset) => {
          const { base } = path.parse(asset);
          return res.replace(asset, `${origin}/static/media/${base}`);
        },
        html,
      );

      const content = juice(`<style>${css}</style>${s3Html}`);

      await fs.writeFile(
        path.resolve(outputDir, `template-${name}.json`),
        JSON.stringify({
          HtmlPart: htmlTemplate(subject, content),
          SubjectPart: subject,
          TemplateName: titleCase(name),
          TextPart: '',
        }),
      );
      return content;
    });

  return Promise.all(tasks);
};

module.exports = class TemplatePlugin {
  constructor(options = {}) {
    this.origin = options.origin;
  }

  apply(compiler) {
    compiler.hooks.done.tapAsync('TemplatePlugin', async (stats, callback) => {
      return apply(stats, this.origin)
        .then((res) => callback(null, res))
        .catch((err) => callback(err));
    });
  }
};
