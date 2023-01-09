import { ComponentProps } from 'react';

import { Button } from '../atoms';
import { OrcidIcon } from '../icons';

type OrcidSigninButtonProps = Pick<
  ComponentProps<typeof Button>,
  'enabled' | 'onClick'
>;
const OrcidSigninButton: React.FC<OrcidSigninButtonProps> = (props) => (
  <Button {...props}>
    <OrcidIcon />
    Continue with ORCID
  </Button>
);

export default OrcidSigninButton;
