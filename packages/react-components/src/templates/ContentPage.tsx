import React from 'react';
import css from '@emotion/css';
import { PageResponse } from '@asap-hub/model';

import { perRem } from '../pixels';
import { Display } from '../atoms';
import { RichText } from '../organisms';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  alignSelf: 'stretch',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type ContentPageProps = Omit<PageResponse, 'id' | 'shortText'>;
const ContentPage: React.FC<ContentPageProps> = ({ text, title }) => (
  <article css={styles}>
    <Display>{title}</Display>
    <RichText toc text={text} />
  </article>
);

export default ContentPage;
