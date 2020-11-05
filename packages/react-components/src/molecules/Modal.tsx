import React from 'react';
import css from '@emotion/css';

import { Card, Overlay } from '../atoms';

import {
  vminLinearCalcClamped,
  mobileScreen,
  tabletScreen,
  perRem,
} from '../pixels';

const overlayContainerStyles = css({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
});

const modalContainerStyles = css({
  position: 'relative',
  width: '100%',
  height: '100%',
});

const modalStyles = css({
  left: '50%',
  top: '50%',
  transform: 'translate(-50%,-50%)',
  position: 'absolute',
  padding: `${12 / perRem}em ${vminLinearCalcClamped(
    mobileScreen,
    12,
    tabletScreen,
    48,
    'px',
  )}`,
  boxSizing: 'border-box',
  width: '100%',
  maxWidth: '800px',
  height: 'max-content',
  maxHeight: '100%',
  justifyContent: 'center',
  overflowY: 'auto',
  bottom: 0,
});

const Modal: React.FC<{}> = ({ children }) => (
  <div css={overlayContainerStyles}>
    <div css={modalContainerStyles}>
      <Overlay />
      <div role="dialog" css={modalStyles}>
        <Card>{children}</Card>
      </div>
    </div>
  </div>
);

export default Modal;
