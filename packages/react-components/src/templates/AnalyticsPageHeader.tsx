import { css } from '@emotion/react';
import { isEnabled } from '@asap-hub/flags';
import { analyticsRoutes } from '@asap-hub/routing';
import { Display, Paragraph, TabLink } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { defaultPageLayoutPaddingStyle } from '../layout';
import TabNav from '../molecules/TabNav';
import {
  EngagementIcon,
  LeadershipIcon,
  ProductivityIcon,
  TeamIcon,
} from '../icons';

const visualHeaderStyles = css({
  padding: `${defaultPageLayoutPaddingStyle} 0`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
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
        <TabLink
          href={analyticsRoutes.DEFAULT.PRODUCTIVITY.buildPath({})}
          Icon={ProductivityIcon}
        >
          Resource & Data Sharing
        </TabLink>
        {isEnabled('DISPLAY_ANALYTICS_BETA') && (
          <TabLink
            href={analyticsRoutes.DEFAULT.COLLABORATION.buildPath({})}
            Icon={TeamIcon}
          >
            Collaboration
          </TabLink>
        )}
        <TabLink
          href={analyticsRoutes.DEFAULT.LEADERSHIP.buildPath({})}
          Icon={LeadershipIcon}
        >
          Leadership & Membership
        </TabLink>
        {isEnabled('DISPLAY_ANALYTICS_BETA') && (
          <TabLink
            href={analyticsRoutes.DEFAULT.ENGAGEMENT.buildPath({})}
            Icon={EngagementIcon}
          >
            Engagement
          </TabLink>
        )}
      </TabNav>
    </div>
  </header>
);

export default AnalyticsPageHeader;
