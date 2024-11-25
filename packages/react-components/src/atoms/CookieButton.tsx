/** @jsxImportSource @emotion/react */
import { css, SerializedStyles } from '@emotion/react';
import React from 'react';
import { neutral200 } from '../colors';
import { cookieIcon } from '../icons';

type CookieButtonProps = {
  toggleCookieModal: () => void;
  isOnboardable?: boolean;
};

const iconStyles = (isOnboardable?: boolean): SerializedStyles =>
  css({
    display: 'flex',
    position: 'fixed',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '0.5em',
    backgroundColor: neutral200.rgb,
    borderRadius: '4px',
    bottom: isOnboardable ? '7em' : '1em',
    left: '1em',
    cursor: 'pointer',
    border: `1.5px solid rgba(223, 229, 234, 0.3)`,
  });

const CookieButton: React.FC<CookieButtonProps> = ({
  toggleCookieModal,
  isOnboardable,
}) => (
  <span
    className="cookie-button"
    css={[iconStyles(isOnboardable)]}
    onClick={toggleCookieModal}
    data-testid="cookie-button"
  >
    {cookieIcon}
  </span>
);
export default CookieButton;
