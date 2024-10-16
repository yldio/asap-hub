import React from 'react';
import { css } from '@emotion/react';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { paper, steel } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

const headerStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    60 / perRem
  }em `,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
  marginBottom: `${30 / perRem}em`,
  display: 'flex',
  justifyContent: 'center',
});

const contentStyles = css({
  display: 'flex',
  flexDirection: 'column',
  maxWidth: `${800 / perRem}em`,
  width: '100%',
  justifyContent: 'center',
});

const ComplianceReportHeader: React.FC = () => (
  <header css={headerStyles}>
    <div css={contentStyles}>
      <Display styleAsHeading={2}>Share a Compliance Report</Display>
      <div>
        <Paragraph noMargin accent="lead">
          Share the compliance report associated with this manuscript.
        </Paragraph>
      </div>
    </div>
  </header>
);

export default ComplianceReportHeader;
