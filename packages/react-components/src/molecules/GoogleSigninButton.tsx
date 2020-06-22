import React, { ComponentProps } from 'react';

import { Button } from '../atoms';
import { googleIcon } from '../icons';

type GoogleSigninButtonProps = Pick<
  ComponentProps<typeof Button>,
  'enabled' | 'onClick'
>;
const GoogleSigninButton: React.FC<GoogleSigninButtonProps> = (props) => (
  <Button {...props}>{googleIcon}Continue with Google</Button>
);

export default GoogleSigninButton;
