import { activeUserMembershipStatus } from '@asap-hub/model';
import {
  DashboardRecommendedUsers,
  DashboardSection,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FC } from 'react';

import { useUsers } from '../../network/users/state';

const LatestUsersSection: FC = () => {
  const recommendedUsers = useUsers({
    searchQuery: '',
    filters: new Set([activeUserMembershipStatus]),
    currentPage: 0,
    pageSize: 3,
  }).items;

  return (
    <DashboardSection
      title="Latest Users"
      description="Explore and learn more about the latest users on the hub."
      viewAllHref={network({}).users({}).$}
    >
      <DashboardRecommendedUsers recommendedUsers={recommendedUsers} />
    </DashboardSection>
  );
};

export default LatestUsersSection;
