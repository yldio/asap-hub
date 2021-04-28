import React, { ReactNode } from 'react';
import css from '@emotion/css';

import { Card } from '../atoms';
import { perRem } from '../pixels';
import { headlineStyles } from '../text';
import { lead } from '../colors';

const containerStyles = css({
  padding: `${16 / perRem}em`,
  color: lead.rgb,
});

type UserProfilePlaceholderCardProps = {
  title: string;
  children: ReactNode;
};

const UserProfilePlaceholderCard: React.FC<UserProfilePlaceholderCardProps> = ({
  title,
  children,
}) => (
  <Card padding={false} accent="placeholder">
    <div css={containerStyles}>
      <h4 css={(headlineStyles[5], [{ margin: 0 }])}>{title}</h4>
      <span>{children}</span>
    </div>
  </Card>
);

export default UserProfilePlaceholderCard;
