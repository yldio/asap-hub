import React from 'react';
import css from '@emotion/css';

import { GoogleSigninButton, OrcidSigninButton } from '../../molecules';

const styles = css({
  display: 'flex',
  flexDirection: 'column',
});

const SsoButtons: React.FC<{}> = () => (
  <div css={styles}>
    <GoogleSigninButton />
    <OrcidSigninButton />
  </div>
);

export default SsoButtons;
