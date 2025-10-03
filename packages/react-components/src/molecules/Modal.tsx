import { ComponentProps, useEffect } from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { Card, Overlay } from '../atoms';

import {
  vminLinearCalcClamped,
  mobileScreen,
  tabletScreen,
  rem,
} from '../pixels';

const overlayContainerStyles = css({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  zIndex: 1,
  overflow: 'hidden',
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
  overflow: 'hidden',
});
const modalStyles = css({
  gridArea: '1 / 1',
  justifySelf: 'center',
  alignSelf: 'center',
  zIndex: 1,

  maxWidth: rem(850),
  maxHeight: '80%',

  display: 'flex',
  padding: `${rem(12)} ${vminLinearCalcClamped(
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
  readonly overrideModalStyles?: SerializedStyles;
};
const Modal: React.FC<ModalProps> = ({
  padding,
  children,
  overrideModalStyles,
}) => {
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div css={overlayContainerStyles}>
      <div css={modalContainerStyles}>
        <div css={overlayStyles}>
          <Overlay />
        </div>
        <div role="dialog" css={css([modalStyles, overrideModalStyles])}>
          <Card padding={padding}>
            <div css={scrollStyles}>{children}</div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Modal;
