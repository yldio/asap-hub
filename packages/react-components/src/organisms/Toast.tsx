import { ReactNode } from 'react';
import { css, CSSObject } from '@emotion/react';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import { layoutStyles } from '../text';
import { Paragraph } from '../atoms';
import {
  crossIcon,
  errorIcon,
  infoCircleYellowIcon,
  informationIcon,
  successIcon,
  successLargeIcon,
} from '../icons';
import {
  perRem,
  vminLinearCalcClamped,
  mobileScreen,
  largeDesktopScreen,
  rem,
} from '../pixels';
import {
  rose,
  ember,
  apricot,
  warning900,
  info100,
  info900,
  info500,
  warning500,
  success100,
  success900,
  success500,
} from '../colors';

const SIDE_PADDING = 24;

const buttonResetStyles = css({
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
});

const iconStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
});
const alignIconWithParagraphStyles = css({
  marginTop: layoutStyles.marginTop,
});

const styles = css({
  boxSizing: 'border-box',
  width: '100%',
  padding: `${vminLinearCalcClamped(
    mobileScreen,
    12,
    largeDesktopScreen,
    6,
    'px',
  )} ${SIDE_PADDING / perRem}em`,
  position: 'relative',
});

const crossIconStyles = css(iconStyles, alignIconWithParagraphStyles, {
  position: 'absolute',
  right: SIDE_PADDING, // right is from border box, not content box
  cursor: 'pointer',
});
const crossPlaceholderStyles = css(iconStyles, {
  display: 'inline-block',
  height: 0,
  paddingTop: 0,
  paddingBottom: 0,

  marginLeft: `${12 / perRem}em`,
});

const wrapStyles = css({
  display: 'flex',
  flexWrap: 'wrap',
  flexFlow: 'row',
  gap: rem(50),
});

export type ToastAccents =
  | 'error'
  | 'info'
  | 'warning'
  | 'success'
  | 'successLarge';

const accentIcons: Record<ToastAccents, EmotionJSX.Element> = {
  error: errorIcon,
  info: informationIcon,
  warning: infoCircleYellowIcon,
  success: successIcon,
  successLarge: successLargeIcon,
};

const accentStyles: Record<ToastAccents, CSSObject> = {
  error: {
    backgroundColor: rose.rgb,
    color: ember.rgb,
    svg: { stroke: ember.rgb },
  },
  info: {
    backgroundColor: info100.rgb,
    color: info900.rgb,
    svg: { stroke: info500.rgb },
  },
  warning: {
    backgroundColor: apricot.rgb,
    color: warning900.rgb,
    svg: { stroke: warning500.rgb },
  },
  success: {
    backgroundColor: success100.rgb,
    color: success900.rgb,
    svg: { stroke: success500.rgb },
  },
  successLarge: {
    backgroundColor: success100.rgb,
    color: success900.rgb,
    svg: { stroke: success500.rgb },
  },
};

interface ToastProps {
  children: ReactNode;
  onClose?: () => void;
  accent?: ToastAccents;
}
const Toast: React.FC<ToastProps> = ({
  children,
  onClose,
  accent = 'error',
}) => (
  <section css={[styles, accentStyles[accent]]}>
    {onClose && (
      <button
        aria-label="Close"
        onClick={onClose}
        css={[buttonResetStyles, crossIconStyles]}
      >
        {crossIcon}
      </button>
    )}
    <div
      css={[
        wrapStyles,
        css({ gap: rem(16), alignItems: 'flex-start', marginBlock: rem(12) }),
      ]}
    >
      <div css={[iconStyles]}>{accentIcons[accent]}</div>
      <div css={[wrapStyles, !onClose && { justifyContent: 'center' }]}>
        <Paragraph noMargin>{children}</Paragraph>
        {onClose && <span css={crossPlaceholderStyles}> </span>}
      </div>
    </div>
  </section>
);

export default Toast;
