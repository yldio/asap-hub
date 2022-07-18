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
  displayName: string;
  past?: boolean;
  link: string;
  type: 'team' | 'group' | 'user';
}> = ({ displayName, past, link, type }) => {
  const eventPeriod = past ? 'Past' : 'Upcoming';
  const lowerEventPeriod = eventPeriod.toLocaleLowerCase();

  return (
    <main css={{ textAlign: 'center' }}>
      <span css={iconStyles}>{calendarIcon}</span>
      <Headline4>
        {displayName} doesn’t have any {lowerEventPeriod} events!
      </Headline4>
      <Paragraph accent="lead">
        It looks like this {type.toLowerCase()} will not speak at any events. In
        the meantime, try exploring other {lowerEventPeriod} events on the Hub.
      </Paragraph>
      <Link href={link} buttonStyle primary>
        {`Explore & ${eventPeriod} Events`}
      </Link>
    </main>
  );
};

export default NoEvents;
