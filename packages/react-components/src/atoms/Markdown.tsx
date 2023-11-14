import { createElement } from 'react';

import unified, { Transformer } from 'unified';
import remark2rehype from 'remark-rehype';
import markdown from 'remark-parse';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import visit from 'unist-util-visit';
import type { Literal, Node, Parent } from 'unist';
import { parseComponents, parseTagNames } from '../utils/parsing';

interface MarkdownProps {
  value: string;
  toc?: boolean;
}

const visitor = (type: string) => {
  return (node: Node, i: number, parent: Parent | undefined) => {
    const { value } = node as Literal<string>;
    const [pattern, tagName] =
      type === 'superscript' ? [/\^/, 'sup'] : [/\~/, 'sub'];
    const values = value.split(pattern);

    if (values.length === 1 || values.length % 2 === 0) {
      return;
    }
    const children = values.map((str, i) =>
      i % 2 === 0
        ? {
            type: 'text',
            value: str,
          }
        : {
            type: type,
            data: {
              hName: tagName,
            },
            children: [
              {
                type: 'text',
                value: str,
              },
            ],
          },
    );
    parent!.children.splice(i!, 1, ...children);
  };
};

const supersubplugin = (): Transformer => {
  return (tree) => {
    visit(tree, 'text', visitor('superscript'));
    visit(tree, 'text', visitor('subscript'));
  };
};

const Markdown = ({ value, toc = false }: MarkdownProps) => {
  let processor = unified()
    .use(markdown)
    .use(supersubplugin)
    .use(remark2rehype);

  if (toc) {
    processor = processor
      .use(rehypeSlug)
      .use(rehypeToc, { headings: ['h1', 'h2'] });
  }

  processor = processor
    .use(rehypeSanitize, { tagNames: parseTagNames() })

    .use(rehypeReact, {
      components: parseComponents,
      createElement,
    });

  const { result } = processor.processSync(value);

  return (
    <div>
      <>{result}</>
    </div>
  );
};

export default Markdown;
