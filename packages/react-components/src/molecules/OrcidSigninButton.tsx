import React, { ComponentProps } from 'react';

import { Button } from '../atoms';
import { orcidIcon } from '../icons';

type OrcidSigninButtonProps = Pick<ComponentProps<typeof Button>, 'enabled'>;
const OrcidSigninButton: React.FC<OrcidSigninButtonProps> = ({ enabled }) => (
  <Button enabled={enabled}>{orcidIcon}Continue with ORCID</Button>
);

export default OrcidSigninButton;
