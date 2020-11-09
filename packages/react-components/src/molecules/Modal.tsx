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

  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
const overlayStyles = css({
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
});
const modalStyles = css({
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
  maxHeight: '100%',

  overflowY: 'auto',
});

const Modal: React.FC<{}> = ({ children }) => (
  <div css={overlayContainerStyles}>
    <div css={modalContainerStyles}>
      <div css={overlayStyles}>
        <Overlay />
      </div>
      <div role="dialog" css={modalStyles}>
        <Card>{children}</Card>
      </div>
    </div>
  </div>
);

export default Modal;
