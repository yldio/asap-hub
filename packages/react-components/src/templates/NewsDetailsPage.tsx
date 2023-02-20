import { css } from '@emotion/react';
import { NewsResponse, NewsType, TutorialsResponse } from '@asap-hub/model';

import { Pill, Display, Card, Caption } from '../atoms';
import { RichTextRenderer } from '../organisms';
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
          <RichTextRenderer text={text} />
        </div>
        {attachmentComponent}
        <div css={footerContainer}>{publishDateComponent}</div>
      </Card>
    </div>
  );
};

export default NewsDetailsPage;
