import { css } from '@emotion/react';
import { calendarIcon } from '../icons';
import { perRem, rem } from '../pixels';
import { charcoal, Display, Link, Paragraph } from '..';

const wrapperStyle = css({
  textAlign: 'center',
  paddingTop: rem(48),
});

const iconStyles = css({
  svg: {
    width: `${40 / perRem}em`,
    height: `${40 / perRem}em`,
    stroke: charcoal.rgb,
  },
});

const NoEvents: React.FC<{
  past?: boolean;
  link: string;
  type: 'team' | 'interest group' | 'working group' | 'member';
}> = ({ past, link, type }) => {
  const eventPeriod = past ? 'Past' : 'Upcoming';
  const lowerEventPeriod = eventPeriod.toLocaleLowerCase();

  return (
    <main css={wrapperStyle}>
      <span css={iconStyles}>{calendarIcon}</span>
      <Display styleAsHeading={3}>
        This {type} doesn’t have any {lowerEventPeriod} events!
      </Display>
      <Paragraph accent="lead">
        In the meantime, try exploring other {lowerEventPeriod} events on the
        Hub.
      </Paragraph>
      <Link href={link} buttonStyle primary>
        {`Explore ${eventPeriod} Events`}
      </Link>
    </main>
  );
};

export default NoEvents;
