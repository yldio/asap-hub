import { DashboardRecommendedUsers } from '@asap-hub/react-components';
import { createUserListAlgoliaResponse } from '@asap-hub/fixtures';
import { number, text } from '@storybook/addon-knobs';

export default {
  title: 'Templates / Dashboard Recommended Users',
  component: DashboardRecommendedUsers,
};

export const Normal = () => (
  <DashboardRecommendedUsers
    recommendedUsers={createUserListAlgoliaResponse(3).items.map((user) => ({
      ...user,
      expertiseAndResourceTags: Array.from(
        new Array(number('Number of tags', 8)),
        (x, i) => text('Tags text', 'Long tag name goes here'),
      ),
    }))}
  />
);
