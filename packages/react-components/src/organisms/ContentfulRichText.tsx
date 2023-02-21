import { css } from '@emotion/react';

import { ContentfulNewsText } from '@asap-hub/model';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document, INLINES, Node } from '@contentful/rich-text-types';

import { Paragraph, Link, Headline4, Headline5, Headline6 } from '../atoms';

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

const renderIFrame = (url: string) => (
  <span css={iframeContainer}>
    <iframe
      title="Embedded Media"
      style={{ maxWidth: '100%', height: 'auto' }}
      src={url}
      allowFullScreen
    />
  </span>
);

function renderOptions(links: NonNullable<ContentfulNewsText>['links']) {
  const assetMap = new Map();
  links.assets.block.forEach((asset) => {
    if (asset?.sys.id) {
      assetMap.set(asset.sys.id, asset);
    }
  });

  const entryMap = new Map();
  links.entries?.inline.forEach((entry) => {
    if (entry?.sys.id) {
      entryMap.set(entry.sys.id, entry);
    }
  });

  links.entries?.block.forEach((entry) => {
    if (entry?.sys.id) {
      entryMap.set(entry.sys.id, entry);
    }
  });

  return {
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: Node, children: React.ReactNode) => (
        <Paragraph>{children}</Paragraph>
      ),
      [BLOCKS.HEADING_1]: (node: Node, children: React.ReactElement) => {
        console.log('node', node);
        console.log('children', children);
        return <Headline4>{children}</Headline4>;
      },
      [BLOCKS.HEADING_2]: (node: Node, children: React.ReactElement) => (
        <Headline5>{children}</Headline5>
      ),
      [BLOCKS.HEADING_3]: (node: Node, children: React.ReactElement) => (
        <Headline6>{children}</Headline6>
      ),
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => (
        <Link href={node.data.uri}>{children}</Link>
      ),

      [INLINES.EMBEDDED_ENTRY]: (node: Node) => {
        const entry = entryMap.get(node.data.target.sys.id);
        return renderIFrame(entry.url);
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: Node) => {
        const entry = entryMap.get(node.data.target.sys.id);
        if (entry.__typename === 'CodeBlock') {
          return (
            <pre>
              <code>{entry.code}</code>
            </pre>
          );
        }

        return renderIFrame(entry.url);
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => {
        const asset = assetMap.get(node.data.target.sys.id);
        const { url, description, contentType, width, height } = asset;

        switch (contentType) {
          case 'application/pdf':
            return (
              <iframe title={url} src={url} width={width} height={height} />
            );

          case 'video/mp4':
            return renderIFrame(url);

          default:
            return (
              <img
                style={{ maxWidth: '100%', height: 'auto' }}
                width="100%"
                src={url}
                alt={description || ''}
              />
            );
        }
      },
    },
  };
}

type ContentfulRichTextProps = {
  text: ContentfulNewsText;
};

const ContentfulRichText: React.FC<ContentfulRichTextProps> = ({ text }) =>
  documentToReactComponents(
    text.json as Document,
    renderOptions(text.links),
  ) as React.ReactElement;

export default ContentfulRichText;
