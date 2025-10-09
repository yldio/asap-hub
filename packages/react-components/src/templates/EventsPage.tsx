import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { rem } from '../pixels';
import EventsPageHeader from './EventsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${rem(36)} ${contentSidePaddingWithNavigation(8)}`,
});

type EventsPageProps = ComponentProps<typeof EventsPageHeader>;

const EventsPage: React.FC<EventsPageProps> = ({ children, ...props }) => (
  <article>
    <EventsPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default EventsPage;
