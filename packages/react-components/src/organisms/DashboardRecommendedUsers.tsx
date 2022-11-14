import { UserResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { RecommendedUser } from '.';
import { perRem, tabletScreen } from '../pixels';

const recommendedUsersStyles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gridGap: `${15 / perRem}em`,
  },
});

type DashboardRecommendedUsersProps = {
  recommendedUsers: UserResponse[];
};

const DashboardRecommendedUsers: React.FC<DashboardRecommendedUsersProps> = ({
  recommendedUsers,
}) => (
  <div css={recommendedUsersStyles}>
    {recommendedUsers.map((user) => (
      <RecommendedUser user={user} />
    ))}
  </div>
);

export default DashboardRecommendedUsers;
