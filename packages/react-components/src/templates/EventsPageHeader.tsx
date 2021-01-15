import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const containerStyles = css({
  alignSelf: 'stretch',
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

const EventsPageHeader: React.FC = () => (
  <header css={containerStyles}>
    <Display styleAsHeading={2}>Calendar and Events</Display>
    <div css={textStyles}>
      <Paragraph accent="lead">
        Find out about upcoming events from ASAP and Groups. You can easily add
        specific calendars to your own Google Calendar to easily stay updated.
      </Paragraph>
    </div>
  </header>
);

export default EventsPageHeader;
