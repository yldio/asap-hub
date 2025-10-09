import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { Card } from '../atoms';
import { rem } from '../pixels';
import { headlineStyles } from '../text';
import { lead } from '../colors';

const containerStyles = css({
  padding: `${rem(15)} ${rem(18)}`,
  color: lead.rgb,
});

type UserProfilePlaceholderCardProps = {
  title?: string;
  children: ReactNode;
};

const UserProfilePlaceholderCard: React.FC<UserProfilePlaceholderCardProps> = ({
  title,
  children,
}) => (
  <Card padding={false} accent="placeholder">
    <div css={containerStyles}>
      {title && (
        <h4 css={(headlineStyles[5], [{ margin: 0, color: lead.rgb }])}>
          {title}
        </h4>
      )}
      <span>{children}</span>
    </div>
  </Card>
);

export default UserProfilePlaceholderCard;
