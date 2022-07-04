import { RemindersCard } from '@asap-hub/react-components';
import { boolean } from '@storybook/addon-knobs';

export default {
  title: 'Organisms / Reminders Card',
  component: RemindersCard,
};

export const Normal = () => (
  <RemindersCard canPublish={boolean('User can publish', true)} />
);
