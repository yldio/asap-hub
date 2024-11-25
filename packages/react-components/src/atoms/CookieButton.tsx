import { css } from '@emotion/react';
import React from 'react';
import { neutral200 } from '../colors';
import { cookieIcon } from '../icons';

type CookieButtonProps = {
  toggleCookieModal: () => void;
  isOnboardable?: boolean;
};

const iconStyles = css({
  display: 'flex',
  position: 'fixed',
  justifyContent: 'center',
  alignItems: 'center',
  padding: '0.5em',
  backgroundColor: neutral200.rgb,
  borderRadius: '4px',
  left: '1em',
  cursor: 'pointer',
  border: `1.5px solid rgba(223, 229, 234, 0.3)`,
  bottom: '1em',
  '&.is-not-onboarded': {
    bottom: '7em',
  },
});

const CookieButton: React.FC<CookieButtonProps> = ({
  toggleCookieModal,
  isOnboardable,
}) => (
  <span
    className={isOnboardable ? 'is-not-onboarded' : ''}
    css={iconStyles}
    onClick={toggleCookieModal}
    data-testid="cookie-button"
  >
    {cookieIcon}
  </span>
);
export default CookieButton;
