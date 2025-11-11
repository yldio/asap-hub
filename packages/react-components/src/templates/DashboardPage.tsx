import { css } from '@emotion/react';

import { rem } from '../pixels';
import { Display } from '../atoms';
import PageContraints from './PageConstraints';

const headerStyles = css({
  paddingBottom: rem(9),
});

type DashboardPageProps = {
  readonly firstName?: string;
};

const Dashboard: React.FC<DashboardPageProps> = ({ firstName, children }) => (
  <PageContraints as="article">
    <div css={headerStyles}>
      <Display styleAsHeading={2}>{`Welcome to the Hub${
        firstName ? `, ${firstName}` : ''
      }!`}</Display>
    </div>
    {children}
  </PageContraints>
);

export default Dashboard;
