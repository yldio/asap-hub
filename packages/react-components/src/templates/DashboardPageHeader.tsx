import React from 'react';
import css from '@emotion/css';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const containerStyles = css({
  alignSelf: 'stretch',
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: '2px',
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

const textStyles = css({
  maxWidth: `${610 / perRem}em`,
});

type DashboardPageHeaderProps = {
  readonly firstName: string;
};

const DashboardPageHeader: React.FC<DashboardPageHeaderProps> = ({
  firstName,
}) => {
  return (
    <header css={containerStyles}>
      <Display
        styleAsHeading={2}
      >{`Welcome to the Hub, ${firstName}!`}</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          The Hub is the beating heart of the ASAP network, where all grantees
          link like neurons of the same brain. You can access grantee profiles,
          view other project proposals and hear the last news and events from
          ASAP.
        </Paragraph>
      </div>
    </header>
  );
};

export default DashboardPageHeader;
