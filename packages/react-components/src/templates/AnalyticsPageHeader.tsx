import { css } from '@emotion/react';

import { analytics } from '@asap-hub/routing';
import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { charcoal, paper, steel } from '../colors';
import { defaultPageLayoutPaddingStyle } from '../layout';
import TabNav from '../molecules/TabNav';
import { LeadershipIcon } from '../icons';

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
            <LeadershipIcon color={charcoal.rgb} />
          </span>
          Leadership & Membership
        </TabLink>
      </TabNav>
    </div>
  </header>
);

export default AnalyticsPageHeader;
