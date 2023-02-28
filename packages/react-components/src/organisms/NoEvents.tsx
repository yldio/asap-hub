import { css } from '@emotion/react';
import { calendarIcon } from '../icons';
import { perRem } from '../pixels';
import { charcoal, Headline4, Link, Paragraph } from '..';

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
  type: 'team' | 'interest group' | 'working group' | 'user';
}> = ({ past, link, type }) => {
  const eventPeriod = past ? 'Past' : 'Upcoming';
  const lowerEventPeriod = eventPeriod.toLocaleLowerCase();

  return (
    <main css={{ textAlign: 'center' }}>
      <span css={iconStyles}>{calendarIcon}</span>
      <Headline4>
        This {type} doesn’t have any {lowerEventPeriod} events!
      </Headline4>
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
