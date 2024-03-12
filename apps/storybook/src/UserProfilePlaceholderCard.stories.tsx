import { text } from './knobs';

import { UserProfilePlaceholderCard } from '@asap-hub/react-components';

export default {
  title: 'Organisms / User Profile Placeholder Card',
  component: UserProfilePlaceholderCard,
};

export const Normal = () => (
  <UserProfilePlaceholderCard
    title={text('Title', 'Which responsibilities do you have in your project?')}
  >
    {text(
      'Body',
      'Tell others about the role you play in your team. This will encourage collaboration.',
    )}
  </UserProfilePlaceholderCard>
);
