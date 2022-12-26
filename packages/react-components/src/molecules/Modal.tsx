import { ComponentProps } from 'react';
import { css } from '@emotion/react';

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
const modalStyles = css({
  gridArea: '1 / 1',
  justifySelf: 'center',
  alignSelf: 'center',
  zIndex: 1,

  maxWidth: `${850 / perRem}em`,
  maxHeight: '80%',

  display: 'flex',
  padding: `${12 / perRem}em ${vminLinearCalcClamped(
    mobileScreen,
    24,
    tabletScreen,
    48,
    'px',
  )}`,
  boxSizing: 'border-box',
});
const scrollStyles = css({
  overflowY: 'auto',
  height: '100%',
});

type ModalProps = Pick<ComponentProps<typeof Card>, 'padding'> & {
  children: React.ReactNode;
};
const Modal: React.FC<ModalProps> = ({ padding, children }) => (
  <div css={overlayContainerStyles}>
    <div css={modalContainerStyles}>
      <div css={overlayStyles}>
        <Overlay />
      </div>
      <div role="dialog" css={modalStyles}>
        <Card padding={padding}>
          <div css={scrollStyles}>{children}</div>
        </Card>
      </div>
    </div>
  </div>
);

export default Modal;
