import React, { ComponentProps } from 'react';

import { Button } from '../atoms';
import { orcidIcon } from '../icons';

type OrcidSigninButtonProps = Pick<
  ComponentProps<typeof Button>,
  'enabled' | 'onClick'
>;
const OrcidSigninButton: React.FC<OrcidSigninButtonProps> = (props) => (
  <Button {...props}>{orcidIcon}Continue with ORCID</Button>
);

export default OrcidSigninButton;
