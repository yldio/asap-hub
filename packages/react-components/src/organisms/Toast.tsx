import { ReactNode } from 'react';
import { css } from '@emotion/react';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';

import { layoutStyles } from '../text';
import { Paragraph } from '../atoms';
import { crossIcon, errorIcon, infoCircleYellow } from '../icons';
import {
  perRem,
  vminLinearCalcClamped,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { rose, ember, apricot, warning900 } from '../colors';

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

const alertStyles = css({
  backgroundColor: rose.rgb,
  color: ember.rgb,
});

const infoStyles = css({
  backgroundColor: apricot.rgb,
  color: warning900.rgb,
  minHeight: `${56 / perRem}em`,
  display: 'flex',
  alignItems: 'center',
  paddingLeft: `${16 / perRem}em`,
  paddingRight: `${16 / perRem}em`,
});

const alertIconStyles = css(iconStyles, {
  marginRight: `${12 / perRem}em`,
});

const infoIconStyles = css(iconStyles, {
  marginRight: `${16 / perRem}em`,
});

const crossIconStyles = css(iconStyles, alignIconWithParagraphStyles, {
  position: 'absolute',
  right: SIDE_PADDING, // right is from border box, not content box

  cursor: 'pointer',
  svg: { stroke: ember.rgb },
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
});

type ToastAccents = 'alert' | 'info';

export const getIcon = (accent: ToastAccents): EmotionJSX.Element => {
  if (accent === 'info') {
    return infoCircleYellow;
  }
  return errorIcon;
};

interface ToastProps {
  children: ReactNode;
  onClose?: () => void;
  accent?: ToastAccents;
}
const Toast: React.FC<ToastProps> = ({
  children,
  onClose,
  accent = 'alert',
}) => (
  <section css={[styles, accent === 'alert' ? alertStyles : infoStyles]}>
    {onClose && (
      <button onClick={onClose} css={[buttonResetStyles, crossIconStyles]}>
        {crossIcon}
      </button>
    )}
    <div css={wrapStyles}>
      <div css={[accent === 'alert' ? alertIconStyles : infoIconStyles]}>
        {getIcon(accent)}
      </div>
      <div css={[wrapStyles, !onClose && { justifyContent: 'center' }]}>
        <Paragraph>{children}</Paragraph>
        {onClose && <span css={crossPlaceholderStyles}> </span>}
      </div>
    </div>
  </section>
);

export default Toast;
