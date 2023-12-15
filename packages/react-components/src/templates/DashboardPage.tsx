import { css } from '@emotion/react';

import { perRem, rem } from '../pixels';
import { Display } from '../atoms';
import { contentSidePaddingWithNavigation } from '../layout';

const articleStyles = css({
  height: '100%',
});

const mainStyles = css({
  padding: `${48 / perRem}em ${contentSidePaddingWithNavigation(8)}`,
  height: '60%',
});

const headerStyles = css({
  paddingBottom: rem(9),
});

type DashboardPageProps = {
  readonly firstName?: string;
};

const Dashboard: React.FC<DashboardPageProps> = ({ firstName, children }) => (
  <article css={articleStyles}>
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
