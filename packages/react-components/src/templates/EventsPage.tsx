import { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { perRem } from '../pixels';
import EventsPageHeader from './EventsPageHeader';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

type EventsPageProps = ComponentProps<typeof EventsPageHeader>;

const EventsPage: React.FC<React.PropsWithChildren<EventsPageProps>> = ({
  children,
  ...props
}) => (
  <article>
    <EventsPageHeader {...props} />
    <main css={mainStyles}>{children}</main>
  </article>
);

export default EventsPage;
