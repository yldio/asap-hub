import { createElement } from 'react';

import unified from 'unified';
import remark2rehype from 'remark-rehype';
import markdown from 'remark-parse';
import rehypeReact from 'rehype-react';
import rehypeSanitize from 'rehype-sanitize';
import { parseComponents, parseTagNames } from '../utils/parsing';

const Markdown = ({ value }: { value: string }) => {
  const processor = unified()
    .use(markdown)
    .use(remark2rehype)
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
