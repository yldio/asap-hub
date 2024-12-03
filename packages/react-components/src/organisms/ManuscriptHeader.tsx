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

type ManuscriptHeaderProps = {
  resubmitManuscript?: boolean;
};

const ManuscriptHeader: React.FC<ManuscriptHeaderProps> = ({
  resubmitManuscript = false,
}) => (
  <header css={headerStyles}>
    <div css={contentStyles}>
      <Display styleAsHeading={2}>{`Submit ${
        resubmitManuscript ? 'Revised' : 'New'
      } Manuscript`}</Display>
      <div>
        <Paragraph noMargin accent="lead">
          {resubmitManuscript
            ? 'Resubmit your manuscript based on the last compliance report you received. All details below were duplicated from the previous manuscript.'
            : 'Start a new manuscript to receive an itemized compliance report outlining action items for compliance with the ASAP Open Science Policy.'}
        </Paragraph>
      </div>
    </div>
  </header>
);

export default ManuscriptHeader;
