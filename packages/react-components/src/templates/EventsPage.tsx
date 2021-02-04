import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import EventsPageHeader from './EventsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const EventsPage: React.FC = ({ children }) => (
  <article>
    <EventsPageHeader />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default EventsPage;
