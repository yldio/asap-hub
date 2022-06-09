import {
  contentSidePaddingWithNavigation,
  Display,
  paper,
  Paragraph,
  pixels,
  steel,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';

const { rem } = pixels;

const containerStyles = css({
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  paddingBottom: `${rem(48)}`,
});

const textStyles = css({
  maxWidth: rem(610),
});

type DashboardPageHeaderProps = {
  readonly firstName?: string;
};

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  firstName,
}) => (
  <header css={containerStyles}>
    <Display styleAsHeading={2}>{`Welcome to the GP2 Hub${
      firstName ? `, ${firstName}` : ''
    }!`}</Display>
    <div css={textStyles}>
      <Paragraph accent="lead">
        The ASAP Hub is the private meeting point for grantees to share research
        ideas, outputs, learn what others are working on, and keep up with
        ASAP’s news and events. Each team has a private workspace and a listing
        of their shared research.
      </Paragraph>
    </div>
  </header>
);

export default DashboardPageHeader;
