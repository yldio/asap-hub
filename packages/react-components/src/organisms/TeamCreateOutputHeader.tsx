import React from 'react';
import { css } from '@emotion/react';
import { ResearchOutputType } from '@asap-hub/model';

import { Display, Paragraph } from '../atoms';
import { perRem } from '../pixels';
import { steel, paper } from '../colors';
import { contentSidePaddingWithNavigation } from '../layout';

type TeamCreateOutputHeaderProps = {
  type: ResearchOutputType;
};

const visualHeaderStyles = css({
  marginBottom: `${30 / perRem}em`,
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
  background: paper.rgb,
  boxShadow: `0 2px 4px -2px ${steel.rgb}`,
});

const textStyles = css({
  maxWidth: `${720 / perRem}em`,
});

const TeamCreateOutputHeader: React.FC<TeamCreateOutputHeaderProps> = ({
  type,
}) => (
  <header>
    <div css={visualHeaderStyles}>
      <Display styleAsHeading={2}>Share {type.toLowerCase()}</Display>
      <div css={textStyles}>
        <Paragraph accent="lead">
          Add your {type.toLowerCase()} code to your third party publication
          platform (e.g. Github) before sharing on the hub.
        </Paragraph>
      </div>
    </div>
  </header>
);

export default TeamCreateOutputHeader;
