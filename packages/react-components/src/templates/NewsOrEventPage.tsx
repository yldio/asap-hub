import React from 'react';
import css from '@emotion/css';
import { NewsOrEventResponse } from '@asap-hub/model';

import { TagLabel, Display, Card } from '../atoms';
import { RichText } from '../organisms';
import { perRem } from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';

const containerStyles = css({
  alignSelf: 'stretch',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type ResearchOutputPageProps = Pick<
  NewsOrEventResponse,
  'text' | 'title' | 'type'
>;

const NewsOrEventPage: React.FC<ResearchOutputPageProps> = ({
  text = '',
  title,
  type,
}) => (
  <div css={containerStyles}>
    <Card>
      <TagLabel>{type}</TagLabel>
      <Display styleAsHeading={3}>{title}</Display>
      <RichText text={text} />
    </Card>
  </div>
);

export default NewsOrEventPage;
