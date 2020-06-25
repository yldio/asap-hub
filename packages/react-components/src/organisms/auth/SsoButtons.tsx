import React from 'react';
import css from '@emotion/css';

import { GoogleSigninButton, OrcidSigninButton } from '../../molecules';

const styles = css({
  display: 'flex',
  flexDirection: 'column',
});

interface SsoButtonsProps {
  readonly onGoogleSignin?: () => void;
  readonly onOrcidSignin?: () => void;
}
const SsoButtons: React.FC<SsoButtonsProps> = ({
  onGoogleSignin,
  onOrcidSignin,
}) => (
  <div css={styles}>
    <GoogleSigninButton onClick={onGoogleSignin} />
    <OrcidSigninButton onClick={onOrcidSignin} />
  </div>
);

export default SsoButtons;
