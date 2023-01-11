import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { Card } from '../atoms';
import { perRem } from '../pixels';
import { headlineStyles } from '../text';
import { charcoal, lead } from '../colors';

const containerStyles = css({
  padding: `${15 / perRem}em ${18 / perRem}em`,
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
        <h4 css={(headlineStyles[5], [{ margin: 0, color: charcoal.rgb }])}>
          {title}
        </h4>
      )}
      <span>{children}</span>
    </div>
  </Card>
);

export default UserProfilePlaceholderCard;
