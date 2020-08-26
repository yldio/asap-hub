import React, { ReactElement, Component } from 'react';

import unified from 'unified';
import rehypeHtml from 'rehype-parse';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeToc from 'rehype-toc';
import rehypeReact, { ComponentLike } from 'rehype-react';

import Paragraph from './Paragraph';
import Display from './Display';
import Headline2 from './Headline2';
import Link from './Link';

interface RichTextProps {
  readonly toc?: boolean;
  readonly text: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
const components = ({
  p: Paragraph,
  h1: Display,
  h2: Headline2,
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

const RichText: React.FC<RichTextProps> = ({ toc = false, text }) => {
  const p = toc ? tocProcessor : processor;
  const { result } = p.processSync(text);
  return <>{result}</>;
};

export default RichText;
