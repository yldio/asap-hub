import React from 'react';
import { css } from '@emotion/core';
import { TeamTool } from '@asap-hub/model';

import { Card, Headline3, Paragraph, Anchor } from '../atoms';
import { placeholderIcon } from '../icons';
import { perRem, tabletScreen } from '../pixels';
import { getIconFromUrl } from '../utils';

type ToolCardProps = Pick<TeamTool, 'description' | 'name' | 'url'> & {
  readonly editHref: string;
};

const containerStyle = css({
  alignItems: 'top',
  display: 'flex',
  flexDirection: 'column',

  [`@media (min-width: ${tabletScreen.width}px)`]: {
    flexDirection: 'row',
  },

  gridColumnGap: `${24 / perRem}em`,
});

const logoIconStyle = css({
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    marginTop: '10px',
  },
});

const ToolCard: React.FC<ToolCardProps> = ({
  name,
  description,
  editHref,
  url,
}) => (
  <Card>
    <div css={containerStyle}>
      <div css={logoIconStyle}>{getIconFromUrl(url) ?? placeholderIcon}</div>
      <div css={{ flex: 1 }}>
        <Anchor href={url}>
          <Headline3 styleAsHeading={4}>{name}</Headline3>
          <Paragraph accent="lead">{description}</Paragraph>
        </Anchor>
        <Anchor href={editHref}>Edit Link</Anchor>
      </div>
    </div>
  </Card>
);

export default ToolCard;
