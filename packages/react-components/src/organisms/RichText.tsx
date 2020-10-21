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

import { Paragraph, Headline2, Headline3, Link } from '../atoms';
import { isTextChildren } from '../text';
import { ErrorCard } from '../molecules';
import { perRem } from '../pixels';

const headline1Spacing = css({ paddingTop: `${24 / perRem}em` });
const components = {
  p: ({ children }: HTMLAttributes<HTMLParagraphElement>) => {
    return <Paragraph>{children}</Paragraph>;
  },
  h1: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) =>
    isTextChildren(children) ? (
      <div css={headline1Spacing}>
        <Headline2 id={id}>{children}</Headline2>
      </div>
    ) : (
      <ErrorCard>Invalid h1 heading styling</ErrorCard>
    ),
  h2: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) =>
    isTextChildren(children) ? (
      <Headline3 id={id}>{children}</Headline3>
    ) : (
      <ErrorCard>Invalid h2 heading styling</ErrorCard>
    ),
  a: ({ children, href }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (!isTextChildren(children)) {
      return <ErrorCard>Invalid link styling with href {href}</ErrorCard>;
    }
    if (typeof href === 'undefined') {
      return <ErrorCard>Link "{children}" is missing href</ErrorCard>;
    }
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
