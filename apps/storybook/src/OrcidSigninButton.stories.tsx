import { OrcidSigninButton } from '@asap-hub/react-components';

import { boolean } from './knobs';

export default {
  title: 'Molecules / Auth / ORCID Signin Button',
  component: OrcidSigninButton,
};

export const Normal = () => (
  <OrcidSigninButton enabled={boolean('Enabled', true)} />
);
