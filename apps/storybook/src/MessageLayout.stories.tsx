import { MessageLayout } from '@asap-hub/react-components';

export default {
  title: 'Messages / Layout',
  component: MessageLayout,
};

export const Normal = () => (
  <MessageLayout appOrigin="https://hub.asap.science">Content</MessageLayout>
);
