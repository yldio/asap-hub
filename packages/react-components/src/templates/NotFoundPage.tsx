import { css } from '@emotion/react';

import { Display, Paragraph, Link } from '../atoms';
import {
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
  perRem,
  tabletScreen,
} from '../pixels';
import { contentSidePaddingWithNavigation } from '../layout';

const styles = css({
  padding: `${vminLinearCalc(
    mobileScreen,
    36,
    largeDesktopScreen,
    72,
    'px',
  )} ${contentSidePaddingWithNavigation()}`,

  display: 'grid',
  gridRowGap: `${12 / perRem}em`,
  textAlign: 'center',

  [`@media (min-width: ${mobileScreen.width + 1}px)`]: {
    justifyItems: 'center',
  },
});

const tabletAndAbove = css({
  [`@media (max-width: ${tabletScreen.min - 1}px)`]: {
    display: 'none',
  },
});

const NotFoundPage: React.FC<Record<string, never>> = () => (
  <div css={styles}>
    <div>
      <Display styleAsHeading={2}>
        Sorry! We can’t seem to find that page.
      </Display>
      <Paragraph>
        Either something went wrong or that page doesn’t exist anymore.{' '}
        <br css={tabletAndAbove} />
        You can always find the latest info on the Dashboard.
      </Paragraph>
    </div>
    <Link buttonStyle primary href="/">
      Dashboard
    </Link>
  </div>
);

export default NotFoundPage;
