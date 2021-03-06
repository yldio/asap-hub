import { PasswordResetEmailSentPage } from '@asap-hub/react-components';
import { BasicLayoutDecorator } from './layout';

export default {
  title: 'Templates / Auth / Forgot Password / Email Sent Page',
  component: PasswordResetEmailSentPage,
  decorators: [BasicLayoutDecorator],
};

export const Normal = () => <PasswordResetEmailSentPage signInHref="#" />;
