import { boolean } from './knobs';

import { GoogleSigninButton } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Auth / Google Signin Button',
  component: GoogleSigninButton,
};

export const Normal = () => (
  <GoogleSigninButton enabled={boolean('Enabled', true)} />
);
