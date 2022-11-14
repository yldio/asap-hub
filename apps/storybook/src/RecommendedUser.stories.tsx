import { RecommendedUser } from '@asap-hub/react-components';
import { createUserResponse } from '@asap-hub/fixtures';
import { number } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Recommended User',
  component: RecommendedUser,
};

export const Normal = () => (
  <RecommendedUser
    user={{
      ...createUserResponse(),
      expertiseAndResourceTags: Array.from(
        new Array(number('Number of tags', 8)),
        (x, i) => `Long tag name goes here${i}`,
      ),
    }}
  />
);
