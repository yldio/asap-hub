import { css } from '@emotion/react';
import { NewsOrEventResponse } from '@asap-hub/model';

import { Pill, Display, Card, Caption } from '../atoms';
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

type NewsOrEventPageProps = Pick<
  NewsOrEventResponse,
  'text' | 'title' | 'type' | 'created' | 'link' | 'linkText'
>;

const NewsOrEventPage: React.FC<NewsOrEventPageProps> = ({
  text = '',
  created,
  title,
  type,
  link,
  linkText,
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
    </div>
  );
};

export default NewsOrEventPage;
