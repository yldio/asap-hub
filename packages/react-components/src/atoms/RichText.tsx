import React, {
  createElement,
  HTMLAttributes,
  AnchorHTMLAttributes,
} from 'react';
import css from '@emotion/css';

import unified from 'unified';
import rehypeHtml from 'rehype-parse';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeReact, { ComponentLike } from 'rehype-react';

import Paragraph from './Paragraph';
import Headline2 from './Headline2';
import Headline3 from './Headline3';
import Link from './Link';
import { assertIsTextChildren } from '../text';

const components = {
  p: ({ children }: HTMLAttributes<HTMLParagraphElement>) => {
    return <Paragraph>{children}</Paragraph>;
  },
  h1: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) => {
    assertIsTextChildren(children);
    return <Headline2 id={id}>{children}</Headline2>;
  },
  h2: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) => {
    assertIsTextChildren(children);
    return <Headline3 id={id}>{children}</Headline3>;
  },
  a: ({ children, href }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    assertIsTextChildren(children);
    if (typeof href === 'undefined')
      throw new Error(`Anchor with children ${children} is missing href`);
    return <Link href={href}>{children}</Link>;
  },
} as Record<string, ComponentLike<ReturnType<typeof createElement>>>;

const processor = unified()
  .use(rehypeHtml, { fragment: true })
  .use(rehypeReact, {
    components,
    createElement,
  });

const tocProcessor = unified()
  .use(rehypeHtml, { fragment: true })
  .use(rehypeSanitize)
  .use(rehypeSlug)
  .use(rehypeToc)
  .use(rehypeReact, {
    components,
    createElement,
  });

interface RichTextProps {
  readonly toc?: boolean;
  readonly text: string;
}

const styles = css`
  .toc-level {
    list-style: none;
  }

  .toc-level-1 {
    padding: 0;
  }
`;

const RichText: React.FC<RichTextProps> = ({ toc = false, text }) => {
  const p = toc ? tocProcessor : processor;
  const { result } = p.processSync(text);
  return (
    <div css={styles}>
      <>{result}</>
    </div>
  );
};

export default RichText;
