import { css } from '@emotion/react';
import { analytics } from '@asap-hub/routing';
import { useFlags } from '@asap-hub/react-context';
import { Button, Display, Paragraph, TabLink } from '../atoms';
import { rem } from '../pixels';
import { paper, steel } from '../colors';
import { defaultPageLayoutPaddingStyle } from '../layout';
import TabNav from '../molecules/TabNav';
import {
  EngagementIcon,
  LeadershipIcon,
  OpenScienceIcon,
  ProductivityIcon,
  TeamIcon,
  downloadIcon,
} from '../icons';

const containerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
});

const visualHeaderStyles = css({
  padding: `${defaultPageLayoutPaddingStyle} 0`,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const textStyles = css({
  maxWidth: rem(610),
});

type AnalyticsPageHeaderProps = {
  onExportAnalytics: () => void;
};

const AnalyticsPageHeader: React.FC<AnalyticsPageHeaderProps> = ({
  onExportAnalytics,
}) => {
  const { isEnabled } = useFlags();

  return (
    <header>
      <div css={visualHeaderStyles}>
        <Display styleAsHeading={2}>Analytics</Display>
        <div css={containerStyles}>
          <div css={textStyles}>
            <Paragraph accent="lead">
              Explore dashboards related to CRN activities.
            </Paragraph>
          </div>
          <div>
            <Button
              onClick={onExportAnalytics}
              primary
              noMargin
              small
              overrideStyles={css({ whiteSpace: 'nowrap' })}
            >
              {downloadIcon} Multiple XLSX
            </Button>
          </div>
        </div>
        <TabNav>
          <TabLink
            href={analytics({}).productivity({}).$}
            Icon={ProductivityIcon}
          >
            Resource & Data Sharing
          </TabLink>
          <TabLink href={analytics({}).collaboration({}).$} Icon={TeamIcon}>
            Collaboration
          </TabLink>
          <TabLink href={analytics({}).leadership({}).$} Icon={LeadershipIcon}>
            Leadership & Membership
          </TabLink>
          <TabLink href={analytics({}).engagement({}).$} Icon={EngagementIcon}>
            Engagement
          </TabLink>
          {isEnabled('ANALYTICS_PHASE_TWO') && (
            <TabLink
              href={analytics({}).openScience({}).$}
              Icon={OpenScienceIcon}
            >
              Open Science
            </TabLink>
          )}
        </TabNav>
      </div>
    </header>
  );
};

export default AnalyticsPageHeader;
