import React, { ComponentProps } from 'react';

import { Button } from '../atoms';
import { googleIcon } from '../icons';

type GoogleSigninButtonProps = Pick<ComponentProps<typeof Button>, 'enabled'>;
const GoogleSigninButton: React.FC<GoogleSigninButtonProps> = ({ enabled }) => (
  <Button enabled={enabled}>{googleIcon}Continue with Google</Button>
);

export default GoogleSigninButton;
