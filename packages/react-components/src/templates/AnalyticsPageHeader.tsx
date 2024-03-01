import { css } from '@emotion/react';

import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { defaultPageLayoutPaddingStyle } from '../layout';
import TabNav from '../molecules/TabNav';
import { LeadershipIcon } from '../icons';
import { analytics } from '@asap-hub/routing';

const visualHeaderStyles = css({
  padding: `${defaultPageLayoutPaddingStyle} 0`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

const iconStyles = css({
  display: 'inline-grid',
  verticalAlign: 'middle',
  paddingRight: `${6 / perRem}em`,
});

const AnalyticsPageHeader: React.FC = () => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Analytics</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Explore dashboards related to CRN activities.
        </Paragraph>
      </div>
      <TabNav>
        <TabLink href={analytics({}).$}>
          <span css={iconStyles}>
            {/* <UserIcon color={page === 'users' ? charcoal.rgb : lead.rgb} /> */}
            <LeadershipIcon />
          </span>
          Leadership & Membership
        </TabLink>
      </TabNav>
    </div>
  </header>
);

export default AnalyticsPageHeader;
