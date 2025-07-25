import { css } from '@emotion/react';

import { PropsWithChildren } from 'react';
import { Display } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';
import { perRem, rem } from '../pixels';

const mainStyles = css({
  padding: `${48 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
});

const headerStyles = css({
  paddingBottom: rem(9),
});

type DashboardPageProps = {
  readonly firstName?: string;
};

const Dashboard: React.FC<PropsWithChildren<DashboardPageProps>> = ({
  firstName,
  children,
}) => (
  <article>
    <main css={mainStyles}>
      <div css={headerStyles}>
        <Display styleAsHeading={2}>{`Welcome to the Hub${
          firstName ? `, ${firstName}` : ''
        }!`}</Display>
      </div>
      {children}
    </main>
  </article>
);

export default Dashboard;
