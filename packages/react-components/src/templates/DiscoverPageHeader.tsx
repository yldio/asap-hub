import { css } from '@emotion/react';
import { discover } from '@asap-hub/routing';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';
import { TabNav, TabLink } from '..';

const containerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} 0`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const DashboardPageHeader: React.FC = () => (
  <header css={containerStyles}>
    <Display styleAsHeading={2}>Guides &amp; Tutorials</Display>
    <Paragraph accent="lead">
      Guidance and resources about ASAP’s programs and policies.
    </Paragraph>
    <TabNav>
      <TabLink href={discover({}).guides({}).$}>Guides</TabLink>
      <TabLink href={discover({}).tutorials({}).$}>Tutorials</TabLink>
    </TabNav>
  </header>
);

export default DashboardPageHeader;
