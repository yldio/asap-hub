import React, {
  createElement,
  HTMLAttributes,
  AnchorHTMLAttributes,
  ImgHTMLAttributes,
} from 'react';
import css from '@emotion/css';

import unified from 'unified';
import rehypeHtml from 'rehype-parse';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeReact, { ComponentLike } from 'rehype-react';

import { Paragraph, Headline2, Headline3, Link } from '../atoms';
import { isTextChildren, isAllowedChildren } from '../text';
import { ErrorCard } from '../molecules';
import { perRem } from '../pixels';

const headline1Spacing = css({ paddingTop: `${24 / perRem}em` });
const components = {
  p: ({ children }: HTMLAttributes<HTMLParagraphElement>) => {
    return <Paragraph>{children}</Paragraph>;
  },
  h1: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) =>
    isAllowedChildren(children) ? (
      <div css={headline1Spacing}>
        <Headline2 id={id}>{children}</Headline2>
      </div>
    ) : (
      <ErrorCard
        title="Styling Error"
        description="Invalid h1 heading styling"
      />
    ),
  h2: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) =>
    isAllowedChildren(children) ? (
      <Headline3 id={id}>{children}</Headline3>
    ) : (
      <ErrorCard
        title="Styling Error"
        description="Invalid h2 heading styling"
      />
    ),
  a: ({ children, href }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    if (!isTextChildren(children)) {
      return (
        <ErrorCard
          title="Styling Error"
          description={`Invalid link styling with href ${href}`}
        />
      );
    }
    if (typeof href === 'undefined') {
      return (
        <ErrorCard
          title="Styling Error"
          description={`"${children}" is missing href`}
        />
      );
    }
    return <Link href={href}>{children}</Link>;
  },
  img: ({ ...props }: ImgHTMLAttributes<HTMLImageElement>) => {
    // Set in Tiny/Squidex and up to editor discretion
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} css={{ height: 'auto', maxWidth: '100%' }} />;
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
