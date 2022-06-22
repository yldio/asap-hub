import { css } from '@emotion/react';
import { getButtonStyles } from '../button';
import { crossInCircleIcon } from '../icons';
import { perRem } from '../pixels';

const titleStyles = css({
  padding: `20px`,

  fontSize: `${26 / perRem}em`,
});

const exploreEventsStyles = css(getButtonStyles({ primary: true }), {
  textDecoration: 'none',
});

const GroupNoEvents: React.FC<{ past?: boolean; link: string }> = ({
  past,
  link,
}) => (
  <main css={{ textAlign: 'center' }}>
    {crossInCircleIcon}
    <div css={titleStyles}>
      <strong>
        This group doesn’t have any {past ? ' past ' : ' upcoming '} events!
      </strong>
    </div>
    <span>
      It looks like this group will not speak at any events. In the meantime,
      try exploring other {past ? ' past ' : ' upcoming '} events on the Hub.
    </span>
    <br />
    <a href={link} css={exploreEventsStyles}>
      Explore {past ? ' Past ' : ' Upcoming '} Events
    </a>
  </main>
);

export default GroupNoEvents;
