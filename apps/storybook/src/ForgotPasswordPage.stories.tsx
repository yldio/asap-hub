import { text } from '@storybook/addon-knobs';
import { ForgotPasswordPage } from '@asap-hub/react-components';
import { BasicLayoutDecorator } from './layout';

export default {
  title: 'Templates / Auth / Forgot Password / Reset Password Page',
  component: ForgotPasswordPage,
  decorators: [BasicLayoutDecorator],
};

export const Normal = () => (
  <ForgotPasswordPage email={text('Email', 'john.doe@example.com')} />
);
