import { DashboardRecommendedUsers } from '@asap-hub/react-components';
import { createListUserResponse } from '@asap-hub/fixtures';

import { number, text } from './knobs';

export default {
  title: 'Templates / Dashboard Recommended Users',
  component: DashboardRecommendedUsers,
};

export const Normal = () => (
  <DashboardRecommendedUsers
    recommendedUsers={createListUserResponse(3).items.map((user) => ({
      ...user,
      _tags: Array.from(new Array(number('Number of tags', 8)), (x, i) =>
        text('Tags text', 'Long tag name goes here'),
      ),
    }))}
  />
);
