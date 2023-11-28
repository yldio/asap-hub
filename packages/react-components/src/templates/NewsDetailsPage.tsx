import { css } from '@emotion/react';
import { NewsResponse, NewsType, TutorialsResponse } from '@asap-hub/model';

import { Pill, Display, Card, Caption, Headline3, Paragraph } from '../atoms';
import { RichText } from '../organisms';
import { perRem, rem } from '../pixels';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { formatDate } from '../date';
import { ExternalLink, TagList } from '../molecules';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: defaultPageLayoutPaddingStyle,
});

const descriptionStyles = css({
  marginTop: `${12 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const footerContainer = css({
  marginTop: `${30 / perRem}em`,
});

const richTextContainer = css({
  marginTop: `${12 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

type NewsDetailsPageProps = (
  | Pick<
      NewsResponse,
      'text' | 'title' | 'created' | 'link' | 'linkText' | 'tags'
    >
  | Pick<
      TutorialsResponse,
      'text' | 'title' | 'created' | 'link' | 'linkText' | 'tags'
    >
) & { type: NewsType };

const NewsDetailsPage: React.FC<NewsDetailsPageProps> = ({
  text = '',
  created,
  title,
  link,
  linkText,
  type,
  tags,
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
          <RichText text={text} />
        </div>
        {attachmentComponent}
        <div css={footerContainer}>{publishDateComponent}</div>
      </Card>
      {!!tags.length && (
        <Card>
          <Headline3 noMargin>Tags</Headline3>
          <div css={descriptionStyles}>
            <Paragraph accent="lead">
              Explore keywords related to skills, techniques, resources, and
              tools.
            </Paragraph>
          </div>
          <div>
            <TagList tags={tags} />
          </div>
        </Card>
      )}
    </div>
  );
};

export default NewsDetailsPage;
