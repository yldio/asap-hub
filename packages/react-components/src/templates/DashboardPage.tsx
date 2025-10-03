import { css } from '@emotion/react';

import { rem } from '../pixels';
import { Display } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';

const mainStyles = css({
  padding: `${rem(48)} ${contentSidePaddingWithNavigation(8)}`,
});

const headerStyles = css({
  paddingBottom: rem(9),
});

type DashboardPageProps = {
  readonly firstName?: string;
};

const Dashboard: React.FC<DashboardPageProps> = ({ firstName, children }) => (
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
