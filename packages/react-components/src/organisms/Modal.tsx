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
  width: '100%',
  height: '100%',
  display: 'grid',
  gridTemplate: '100% / 100%',
  overflow: 'hidden',
});
const overlayStyles = css({
  gridArea: '1 / 1',
});
const scrollStyles = css({
  gridArea: '1 / 1',
  zIndex: 1,

  display: 'grid',
  justifyItems: 'center',
  alignItems: 'center',
  overflowY: 'auto',
});
const modalStyles = css({
  padding: `${12 / perRem}em ${vminLinearCalcClamped(
    mobileScreen,
    12,
    tabletScreen,
    48,
    'px',
  )}`,
  boxSizing: 'border-box',
  maxWidth: '800px',
});

const Modal: React.FC<{}> = ({ children }) => (
  <div css={overlayContainerStyles}>
    <div css={modalContainerStyles}>
      <div css={overlayStyles}>
        <Overlay />
      </div>
      <div css={scrollStyles}>
        <div role="dialog" css={modalStyles}>
          <Card>{children}</Card>
        </div>
      </div>
    </div>
  </div>
);

export default Modal;
