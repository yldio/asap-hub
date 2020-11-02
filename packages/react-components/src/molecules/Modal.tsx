import React from 'react';
import ReactDOM from 'react-dom';
import css from '@emotion/css';

import { Card, Overlay } from '../atoms';

import {
  vminLinearCalcClamped,
  mobileScreen,
  largeDesktopScreen,
  tabletScreen,
} from '../pixels';

const overlayContainerStyles = css({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
});

const modalContainerStyles = css({
  top: 0,
  left: 0,
  position: 'absolute',
  padding: `${vminLinearCalcClamped(
    mobileScreen,
    63,
    largeDesktopScreen,
    300,
    'px',
  )} ${vminLinearCalcClamped(mobileScreen, 12, tabletScreen, 48, 'px')}`,
  boxSizing: 'border-box',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
});

const cardContainer = css({
  maxWidth: '725px',
});

const modalRoot = document.getElementById('modal-root');

const Modal: React.FC<{}> = ({ children }) =>
  modalRoot
    ? ReactDOM.createPortal(
        <>
          <div css={overlayContainerStyles}>
            <Overlay />
          </div>
          <div role="dialog" css={modalContainerStyles}>
            <Card>
              <div css={cardContainer}>{children}</div>
            </Card>
          </div>
        </>,
        modalRoot,
      )
    : null;

export default Modal;
