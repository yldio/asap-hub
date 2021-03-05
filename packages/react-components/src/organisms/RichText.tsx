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
import githubSanitizationSchema from 'hast-util-sanitize/lib/github';

import { Paragraph, Headline4, Headline5, Headline6, Link } from '../atoms';
import { isTextChildren, isAllowedChildren } from '../text';
import { ErrorCard } from '../molecules';
import { perRem } from '../pixels';

const headline1Spacing = css({ paddingTop: `${24 / perRem}em` });
const iframeContainer = css({
  display: 'block',
  position: 'relative',
  paddingBottom: '56.25%',
  width: '100%',
  height: 0,

  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',

    border: 0,
  },
});

const components = {
  p: ({ children }: HTMLAttributes<HTMLParagraphElement>) => (
    <Paragraph>{children}</Paragraph>
  ),
  iframe: (props: HTMLAttributes<HTMLIFrameElement>) => (
    <span css={iframeContainer}>
      <iframe title="Embedded Page" {...props} />
    </span>
  ),
  h1: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) =>
    isAllowedChildren(children) ? (
      <div css={headline1Spacing}>
        <Headline4 id={id}>{children}</Headline4>
      </div>
    ) : (
      <ErrorCard
        title="Styling Error"
        description="Invalid h1 heading styling"
      />
    ),
  h2: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) =>
    isAllowedChildren(children) ? (
      <Headline5 id={id}>{children}</Headline5>
    ) : (
      <ErrorCard
        title="Styling Error"
        description="Invalid h2 heading styling"
      />
    ),
  h3: ({ children, id }: HTMLAttributes<HTMLHeadingElement>) =>
    isAllowedChildren(children) ? (
      <Headline6 id={id}>{children}</Headline6>
    ) : (
      <ErrorCard
        title="Styling Error"
        description="Invalid h3 heading styling"
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
  img: ({ ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    // Set in Tiny/Squidex and up to editor discretion
    // eslint-disable-next-line jsx-a11y/alt-text
    <img {...props} css={{ height: 'auto', maxWidth: '100%' }} />
  ),
} as Record<string, ComponentLike<ReturnType<typeof createElement>>>;

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
  let processor = unified().use(rehypeHtml, { fragment: true });

  processor = processor.use(rehypeSanitize, {
    tagNames: [
      ...Object.keys(components),
      // text modifiers with default UA styling
      'strong',
      'em',
      'sub',
      'sup',
      'i',
      'b',
      // lists with default UA styling
      'ul',
      'ol',
      'li',
      // media
      'img',
      'iframe',
      // rehype-toc
      'nav',
    ],
    attributes: {
      ...githubSanitizationSchema.attributes,
      iframe: [
        'src',
        'title',
        'width',
        'height',
        ['allow', 'fullscreen'],
        'allowfullscreen',
      ],
    },
  });

  if (toc) {
    processor = processor.use(rehypeSlug).use(rehypeToc);
  }

  processor = processor.use(rehypeReact, {
    components,
    createElement,
  });

  const { result } = processor.processSync(text);
  return (
    <div css={styles}>
      <>{result}</>
    </div>
  );
};

export default RichText;
