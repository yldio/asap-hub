import { css } from '@emotion/react';
import {
  ContentfulNewsText,
  NewsResponse,
  NewsType,
  TutorialsResponse,
} from '@asap-hub/model';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, Document, INLINES, Node } from '@contentful/rich-text-types';

import { Pill, Display, Card, Caption, Paragraph, Link } from '../atoms';
import { RichText } from '../organisms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';
import { formatDate } from '../date';
import { ExternalLink } from '../molecules';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const footerContainer = css({
  marginTop: `${30 / perRem}em`,
});

const richTextContainer = css({
  marginTop: `${12 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

type NewsDetailsPageProps = (
  | Pick<NewsResponse, 'text' | 'title' | 'created' | 'link' | 'linkText'>
  | Pick<TutorialsResponse, 'text' | 'title' | 'created' | 'link' | 'linkText'>
) & { type: NewsType };

// Create a bespoke renderOptions object to target BLOCKS.EMBEDDED_ENTRY (linked block entries e.g. code blocks)
// INLINES.EMBEDDED_ENTRY (linked inline entries e.g. a reference to another blog post)
// and BLOCKS.EMBEDDED_ASSET (linked assets e.g. images)

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
      [INLINES.HYPERLINK]: (node: Node, children: React.ReactNode) => {
        return <Link href={node.data.uri}>{children}</Link>;
      },

      [INLINES.EMBEDDED_ENTRY]: (node: Node) => {
        const entry = entryMap.get(node.data.target.sys.id);
        return (
          <iframe
            src={entry.url}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            title={entry?.title}
            allowFullScreen={true}
          />
        );
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

        return (
          <iframe
            src={entry.url}
            height="100%"
            width="100%"
            frameBorder="0"
            scrolling="no"
            title={entry.title}
            allowFullScreen={true}
          />
        );
      },
      [BLOCKS.EMBEDDED_ASSET]: (node: Node) => {
        const asset = assetMap.get(node.data.target.sys.id);
        const { url, description, contentType, width, height } = asset;

        switch (contentType) {
          case 'application/pdf':
            return <iframe src={url} width={width} height={height} />;

          case 'video/mp4':
            return (
              <iframe src={url} width={width} height={height} allowFullScreen />
            );

          default:
            return (
              <img
                style={{ maxWidth: '100%', height: 'auto' }}
                src={url}
                alt={description || ''}
              />
            );
        }
      },
    },
  };
}

const NewsDetailsPage: React.FC<NewsDetailsPageProps> = ({
  text = '',
  created,
  title,
  link,
  linkText,
  type,
}) => {
  const attachmentComponent = link ? (
    <div>
      <Caption bold asParagraph>
        Attachments
      </Caption>
      <ExternalLink href={link} label={linkText} />
    </div>
  ) : null;
  const publishDateComponent = (
    <Caption accent={'lead'} asParagraph>
      Posted: {formatDate(new Date(created))} by ASAP
    </Caption>
  );

  return (
    <div css={containerStyles}>
      <Card>
        <Pill>{type}</Pill>
        <Display styleAsHeading={3}>{title}</Display>
        {publishDateComponent}
        <div css={richTextContainer}>
          {!text ? null : typeof text !== 'string' ? (
            documentToReactComponents(
              text.json as Document,
              renderOptions(text.links),
            )
          ) : (
            <RichText text={text} />
          )}
        </div>
        {attachmentComponent}
        <div css={footerContainer}>{publishDateComponent}</div>
      </Card>
    </div>
  );
};

export default NewsDetailsPage;
