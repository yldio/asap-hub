/* eslint-disable no-console */
/* eslint-disable no-param-reassign */

import { Document } from '@contentful/rich-text-types';
import { parseHtml } from 'contentful-html-rich-text-converter';

export const clearParsedHtmlOutput = (htmlDocument: Document) => ({
  ...htmlDocument,
  content: htmlDocument?.content
    .map((node) =>
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

export const convertText = async <T extends { 'en-US': Document | null }>(
  payload: T,
  text: string | null,
  id: string,
) => {
  if (text) {
    const textWithoutDivTag = text.replace(/<[\\/]{0,1}(div)[^><]*>/g, '');

    try {
      const parsedHtml = parseHtml(textWithoutDivTag) as Document;

      payload['en-US'] = clearParsedHtmlOutput(parsedHtml);
    } catch {
      console.log(`There is a problem converting rich text from entry ${id}`);
    }
  }
};
