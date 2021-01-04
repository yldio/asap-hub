import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import NewsAndEventsPageHeader from './NewsAndEventsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  alignSelf: 'stretch',
});

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const NewsAndEventsPage: React.FC = ({ children }) => (
  <article css={articleStyles}>
    <NewsAndEventsPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default NewsAndEventsPage;
