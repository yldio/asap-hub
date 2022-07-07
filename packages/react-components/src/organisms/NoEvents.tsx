import { css } from '@emotion/react';
import { getButtonStyles } from '../button';
import { calendarIcon } from '../icons';
import { perRem } from '../pixels';
import { lead, charcoal } from '../colors';

const titleStyles = css({
  padding: '15px',
  fontWeight: 'bold',
  fontSize: `${27 / perRem}em`,
  margin: 0,
});

const iconStyles = css({
  '> svg': {
    width: '36px',
    height: '36px',

    '> g': {
      stroke: charcoal.rgb,
    },
  },
});

const exploreEventsStyles = css(
  getButtonStyles({ primary: true, stretch: false }),
  {
    textDecoration: 'none',
    paddingLeft: `${33 / perRem}em`,
    paddingRight: `${33 / perRem}em`,
    paddingTop: `${15 / perRem}em`,
    paddingBottom: `${15 / perRem}em`,
  },
);

const NoEvents: React.FC<{
  displayName: string;
  past?: boolean;
  link: string;
  type: 'team' | 'group';
}> = ({ displayName, past, link, type }) => (
  <main css={{ textAlign: 'center' }}>
    <span css={iconStyles}>{calendarIcon}</span>
    <h4 css={titleStyles}>
      {displayName} doesn’t have any {past ? ' past ' : ' upcoming '} events!
    </h4>
    <span color={lead.rgb}>
      It looks like this {type.toLowerCase()} will not speak at any events. In
      the meantime, try exploring other {past ? ' past ' : ' upcoming '} events
      on the Hub.
    </span>
    <br />
    <a href={link} css={exploreEventsStyles}>
      Explore {past ? ' Past ' : ' Upcoming '} Events
    </a>
  </main>
);

export default NoEvents;
