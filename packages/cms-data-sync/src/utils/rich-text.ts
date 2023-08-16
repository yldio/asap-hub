import * as cheerio from 'cheerio';
import { Environment, Maybe } from '@asap-hub/contentful';
import {
  Document,
  Node,
  Block,
  Inline,
  Text,
  TopLevelBlock,
} from '@contentful/rich-text-types';
import {
  parseHtml,
  parseAssets,
  parseIFrames,
} from 'contentful-html-rich-text-converter';

import unified from 'unified';
import rehypeHtml from 'rehype-parse';
import rehypeSanitize from 'rehype-sanitize';
import rehypeRemark from 'rehype-remark';
import remarkStringify from 'remark-stringify';

import { createInlineAssets, createMediaEntries } from '.';
import { logger } from './logs';

export const removeStylingTagsWrappingIFrameTags = (html: string): string =>
  html.replace(
    /(<(strong|em|i|b)>)+(<iframe [^>]*><\/iframe>)(<(\/strong|\/em|\/i|\/b)>)+/gi,
    '$3',
  );

export const removeStylingTagsWrappingImgTags = (html: string): string =>
  html.replace(
    /(<(strong|em|i|b)>)+(<img [^>]*\/>)(<(\/strong|\/em|\/i|\/b)>)+/gi,
    '$3',
  );

export const wrapIframeWithPTag = (html: string): string => {
  const $ = cheerio.load(html);
  const iframe = $('iframe');

  if (iframe.length > 0 && iframe.parent().is('body')) {
    iframe.wrap('<p></p>');
  }

  const output = $('body').html();

  return output ?? html;
};

export const removeSinglePTag = (html: string): string => {
  const openingTag = '<p>';
  const closingTag = '</p>';

  if (html.endsWith(closingTag)) {
    const lastIndexOpeningTag = html.lastIndexOf(openingTag);

    if (lastIndexOpeningTag === -1) {
      return html.substring(0, html.length - closingTag.length);
    }
  }

  if (html.startsWith(openingTag)) {
    const lastIndexClosingTag = html.lastIndexOf(closingTag);

    if (lastIndexClosingTag === -1) {
      return html.substring(openingTag.length, html.length);
    }
  }

  return html;
};

const wrapNestedLists = (html: string): string => {
  const $ = cheerio.load(html);

  $('ul > ul').each((_, element) => {
    const previous = $(element).prev();
    if (previous && previous.length && previous[0].name === 'li') {
      $(element).appendTo(previous);
    } else {
      $(element).wrap('<li></li>');
    }
  });

  return $('body').html() ?? html;
};

type ParentNode = cheerio.ParentNode & { name?: string };
export const wrapPlainTextWithPTag = (html: string): string => {
  const $ = cheerio.load(html);

  const excludedTags = [
    'sup',
    'sub',
    'span',
    'a',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'strong',
    'b',
    'em',
    'i',
    'u',
    'li',
  ];

  const filterTags = (parent: ParentNode | null) =>
    parent && parent?.name && !excludedTags.includes(parent.name);

  $('*:not(p)')
    .contents()
    .filter((_, element) =>
      Boolean(
        filterTags(element?.parent) &&
          element.nodeType === 3 &&
          element.nodeValue &&
          element.nodeValue.trim().length > 0,
      ),
    )
    .wrap('<p></p>');

  return $('body').html() ?? html;
};

type SomeNode = Block | Inline | Text;
const removeEmptyTextNodes = (list: SomeNode[], node: SomeNode): SomeNode[] => {
  if (node.nodeType === 'text' && 'value' in node) {
    return node.value ? [...list, node] : list;
  }

  return [
    ...list,
    {
      ...node,
      content: (node.content as SomeNode[]).reduce(removeEmptyTextNodes, []),
    } as Block | Inline,
  ];
};

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
    .map((node) =>
      // if an image is wrapped in an inline tag then if creates an
      // empty text node in the `content` of the `embedded-asset-block`
      // which contentful rejects because embedded assets cannot have
      // child contents
      node.nodeType === 'embedded-asset-block'
        ? {
            ...node,
            content: [],
          }
        : node,
    )
    /*
      Wrap any text nodes that have content into a paragraph.
      Where there are multiple consecutive text nodes then place all
      into the same paragraph container.
    */
    .reduce(
      (nodes: TopLevelBlock[], node: Text | TopLevelBlock): TopLevelBlock[] => {
        if (node?.nodeType === 'text' && node?.value.trim()) {
          // if the previous node was a paragraph then roll the text node into that paragraph
          if (nodes[nodes.length - 1]?.nodeType === 'paragraph') {
            nodes[nodes.length - 1].content.push(node);
            return nodes;
          }
          // otherwise wrap the text node in a paragraph
          return [
            ...nodes,
            {
              content: [node],
              data: {},
              nodeType: 'paragraph',
            } as TopLevelBlock,
          ];
        }
        return [...nodes, node as TopLevelBlock];
      },
      [],
    )
    /* 
      When we have \n in html, parseHtml function from 
      contentful-html-rich-text-converter converts it 
      to a node with nodeType equals text which is 
      unprocessable by contentful, leading to an error.

      In squidex when we have a new empty line it appears
      in html as \n<p>&nbsp;</p>\n. This part <p>&nbsp;</p>
      generates a node like:
      {
        content: [{ data: {}, marks: [], nodeType: 'text', value: ' ' }],
        data: {},
        nodeType: 'paragraph',
      },
      which is a valid node and already represents a new empty line.
      The nodes generated by \n:
      {
        "data": {},
        "marks": [],
        "value": "\n",
        "nodeType": "text"
      },
      then can be filtered without losing the new line purpose
    */
    .filter((node: Node) => node?.nodeType !== 'text')
    .reduce(removeEmptyTextNodes, []) as TopLevelBlock[],
});

export const convertHtmlToContentfulFormat = (html: string) => {
  // parsedHtml from contentful-html-rich-text-converter
  // does not know how to deal with div, but they are not
  // an important part of rich text input anyway, so we
  // can just remove them here
  let processedHtml;
  processedHtml = html.replace(/<[\\/]{0,1}(div)[^><]*>/g, '');
  processedHtml = removeSinglePTag(processedHtml);
  processedHtml = removeStylingTagsWrappingIFrameTags(processedHtml);
  processedHtml = removeStylingTagsWrappingImgTags(processedHtml);
  processedHtml = wrapIframeWithPTag(processedHtml);
  processedHtml = wrapPlainTextWithPTag(processedHtml);
  processedHtml = wrapNestedLists(processedHtml);

  logger(`HTML pre-parsed:\n${html}`, 'DEBUG');
  logger(`HTML post-parsed:\n${processedHtml}`, 'DEBUG');

  const parsedHtml = parseHtml(processedHtml) as Document;
  const inlineAssetBodies = parseAssets(processedHtml);
  const inlineIFramesBodies = parseIFrames(processedHtml);

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

export const createDocumentIfNeeded = async (
  contentfulEnvironment: Environment,
  field: Maybe<string>,
) => {
  if (field) {
    const { document, inlineAssetBodies, inlineIFramesBodies } =
      convertHtmlToContentfulFormat(field);
    await createInlineAssets(contentfulEnvironment, inlineAssetBodies);
    await createMediaEntries(contentfulEnvironment, inlineIFramesBodies);
    return document;
  }
  return null;
};

export function richTextToMarkdown(text = ''): string {
  let processor = unified().use(rehypeHtml, { fragment: true });
  processor = processor.use(rehypeSanitize, {
    tagNames: ['a', 'p', 'br'],
  });

  processor = processor.use(rehypeRemark).use(remarkStringify, {
    bullet: '*',
    fence: '~',
    fences: true,
    incrementListMarker: false,
  });

  const { contents } = processor.processSync(text);
  const markdownText = contents as string;

  return markdownText.replace(/\n$/, '');
}
