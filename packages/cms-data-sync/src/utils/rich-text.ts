import { Document } from '@contentful/rich-text-types';
import {
  parseHtml,
  parseAssets,
  parseIFrames,
} from 'contentful-html-rich-text-converter';
import { logger } from './logs';
import { getAssetId } from './assets';

export const clearParsedHtmlOutput = (htmlDocument: Document) => ({
  ...htmlDocument,
  content: htmlDocument?.content
    .map((node) =>
      // parseHtml from contentful-html-rich-text-converter
      // sometimes returns elements inside content that are
      // not of type list-item, this causes an error
      // when we try to create an entry in Contentful
      // This function filters the content of ul and ol to
      // be only li
      node.nodeType === 'unordered-list' || node.nodeType === 'ordered-list'
        ? {
            ...node,
            content: node.content.filter(
              (childNode: { nodeType: string }) =>
                childNode.nodeType === 'list-item',
            ),
          }
        : node,
    )
    // The external lib 'parseHtml' we are using may return
    // an output with incorrect nodeType, that's why
    // we need to overwrite its type to any and filter
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((node: any) => node?.nodeType !== 'text'),
});

export const convertHtmlToContentfulFormat = (html: string) => {
  // parsedHtml from contentful-html-rich-text-converter
  // does not know how to deal with div, but they are not
  // an important part of rich text input anyway, so we
  // can just remove them here
  const htmlWithoutDivTag = html.replace(/<[\\/]{0,1}(div)[^><]*>/g, '');
  logger(`HTML pre-parsed:\n${html}`, 'DEBUG');
  logger(`HTML post-parsed:\n${htmlWithoutDivTag}`, 'DEBUG');

  const parsedHtml = parseHtml(htmlWithoutDivTag, getAssetId) as Document;
  const inlineAssetBodies = parseAssets(htmlWithoutDivTag, getAssetId);
  const inlineIFramesBodies = parseIFrames(htmlWithoutDivTag);

  logger(
    `Parsed HTML in Contentful format:\n${JSON.stringify(
      parsedHtml,
      undefined,
      2,
    )}`,
    'DEBUG',
  );

  const document = clearParsedHtmlOutput(parsedHtml);
  logger(
    `Cleaned Contentful Document:\n${JSON.stringify(document, undefined, 2)}`,
    'DEBUG',
  );

  return { document, inlineAssetBodies, inlineIFramesBodies };
};
