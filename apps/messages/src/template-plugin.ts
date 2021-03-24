import createCache from '@emotion/cache';
import createEmotionServer from 'create-emotion-server';
import juice from 'juice';
import path from 'path';
import React from 'react';
import { CacheProvider } from '@emotion/core';
import { promises as fs } from 'fs';
import { renderToStaticMarkup } from 'react-dom/server';
import { titleCase } from 'title-case';
import { Compiler, Stats } from 'webpack';
import { URL } from 'url';

import { APP_ORIGIN } from './config';

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

const apply = async (stats: Stats) => {
  const outputDir = stats.compilation.outputOptions.path;
  if (!outputDir) {
    throw new Error('Cannot determine output dir');
  }

  const files = await fs.readdir(outputDir);
  const tasks = files
    .filter((file) => path.extname(file) === '.js')
    .map(async (file) => {
      const cache = createCache();
      const { extractCritical } = createEmotionServer(cache);
      const template = require(path.resolve(outputDir, file)) as Record<
        string,
        unknown
      >;
      const { name } = path.parse(file);

      const reactElement = template.default as React.ReactElement;
      if (
        typeof reactElement === 'object' &&
        !React.isValidElement(reactElement)
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

      const { html, css } = extractCritical(renderToStaticMarkup(element));
      const s3Html = Object.keys(stats.compilation.assets).reduce(
        (res, asset) => {
          const { base } = path.parse(asset);
          return res.replace(
            asset,
            new URL(`/.messages-static/${base}`, APP_ORIGIN).toString(),
          );
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
      console.log(`Template ${name} written.`);
      return content;
    });

  return Promise.all(tasks);
};

const plugin = (compiler: Compiler): void => {
  compiler.hooks.done.tapAsync('TemplatePlugin', async (stats, callback) =>
    apply(stats)
      .then(() => callback(null))
      .catch((err) => callback(err)),
  );
};

export default plugin;
