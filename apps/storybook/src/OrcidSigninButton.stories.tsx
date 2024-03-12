import { boolean } from './knobs';

import { OrcidSigninButton } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Auth / ORCID Signin Button',
  component: OrcidSigninButton,
};

export const Normal = () => (
  <OrcidSigninButton enabled={boolean('Enabled', true)} />
);
