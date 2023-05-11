import { createElement } from 'react';

import unified from 'unified';
import remark2rehype from 'remark-rehype';
import markdown from 'remark-parse';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import { parseComponents, parseTagNames } from '../utils/parsing';

interface MarkdownProps {
  value: string;
  toc?: boolean;
}

const Markdown = ({ value, toc = false }: MarkdownProps) => {
  let processor = unified().use(markdown).use(remark2rehype);

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
