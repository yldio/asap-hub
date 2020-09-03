import React, { ReactElement, Component } from 'react';
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

/* eslint-disable @typescript-eslint/no-explicit-any */
const components = ({
  p: Paragraph,
  h1: Headline2,
  h2: Headline3,
  a: Link,
} as unknown) as {
  [element: string]: ComponentLike<
    ReactElement<
      {},
      | string
      | ((
          props: any,
        ) => ReactElement<
          any,
          string | any | (new (props: any) => Component<any, any, any>)
        > | null)
      | (new (props: any) => Component<any, any, any>)
    >
  >;
};

const processor = unified()
  .use(rehypeHtml, { fragment: true })
  .use(rehypeReact, {
    components,
    createElement: React.createElement,
    passNode: true,
  });

const tocProcessor = unified()
  .use(rehypeHtml, { fragment: true })
  .use(rehypeSanitize)
  .use(rehypeSlug)
  .use(rehypeToc)
  .use(rehypeReact, {
    components,
    createElement: React.createElement,
    passNode: true,
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
