import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import createEmotionServer from '@emotion/server/create-instance';
import { promises as fs } from 'fs';
import juice from 'juice';
import path from 'path';
import * as React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { titleCase } from 'title-case';
import { URL } from 'url';
import { Compiler, Stats } from 'webpack';

const htmlTemplate = (
  title: string,
  content: string,
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

const apply = async (stats: Stats, appOrigin: string) => {
  const outputDir = stats.compilation.outputOptions.path;
  if (!outputDir) {
    throw new Error('Cannot determine output dir');
  }

  const readOutputDir = async (): Promise<string[]> => {
    try {
      return await fs.readdir(outputDir);
    } catch (e) {
      console.error(e);
      return [];
    }
  };
  const files = await readOutputDir();
  const tasks = files
    .filter((file) => path.extname(file) === '.js')
    .map(async (file) => {
      const key = file;
      const cache = createCache({ key });
      const { extractCritical } = createEmotionServer(cache);
      const template = require(path.resolve(outputDir, file)) as Record<
        string,
        unknown
      >;
      const { name } = path.parse(file);

      const reactElement = template.default as React.ReactElement;
      if (
        !(
          typeof reactElement === 'object' && React.isValidElement(reactElement)
        )
      ) {
        throw new Error(
          `Template ${file} does not default export a valid React element`,
        );
      }

      const subject = template.subject as string | undefined;
      if (!(typeof subject === 'string')) {
        throw new Error(`Template ${file} does not export a subject string`);
      }

      const element = React.createElement(
        CacheProvider,
        { value: cache },
        reactElement,
      );

      const { html, css, ids } = extractCritical(renderToStaticMarkup(element));
      const s3Html = Object.keys(stats.compilation.assets).reduce(
        (res, asset) => {
          const { base } = path.parse(asset);
          return res.replace(
            asset,
            new URL(`/.messages-static/${base}`, appOrigin).toString(),
          );
        },
        html,
      );

      const content = juice(
        `<style data-emotion="${key} ${ids.join(' ')}">${css}</style>${s3Html}`,
      );

      await fs.writeFile(
        path.resolve(outputDir, `template-${name}.json`),
        JSON.stringify({
          HtmlPart: htmlTemplate(subject, content),
          SubjectPart: subject,
          TemplateName: titleCase(name),
          TextPart: '',
        }),
      );
      console.log(`Template ${name} written.`);
      return content;
    });

  return Promise.all(tasks);
};

const plugin =
  (appOrigin: string) =>
  (compiler: Compiler): void => {
    compiler.hooks.done.tapAsync('TemplatePlugin', async (stats, callback) =>
      apply(stats, appOrigin)
        .then(() => callback(null))
        .catch((err) => callback(err)),
    );
  };

export { plugin as TemplatePlugin };
