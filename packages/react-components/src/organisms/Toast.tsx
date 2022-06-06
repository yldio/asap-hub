import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { layoutStyles } from '../text';
import { Paragraph } from '../atoms';
import { crossIcon, AlertIcon } from '../icons';
import {
  perRem,
  lineHeight,
  vminLinearCalcClamped,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import { rose, ember, clay } from '../colors';

const SIDE_PADDING = 24;

const buttonResetStyles = css({
  padding: 0,
  border: 'none',
  backgroundColor: 'unset',
});

const iconStyles = css({
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,

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

  backgroundColor: rose.rgb,
  color: ember.rgb,
});

const alertIconStyles = css(iconStyles, alignIconWithParagraphStyles, {
  marginRight: `${12 / perRem}em`,
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
});

interface ToastProps {
  children: ReactNode;
  onClose?: () => void;
}
const Toast: React.FC<ToastProps> = ({ children, onClose }) => (
  <section css={styles}>
    {onClose && (
      <button onClick={onClose} css={[buttonResetStyles, crossIconStyles]}>
        {crossIcon}
      </button>
    )}
    <div css={wrapStyles}>
      <div css={alertIconStyles}>{<AlertIcon color={clay.rgb} />}</div>
      <div css={[wrapStyles, !onClose && { justifyContent: 'center' }]}>
        <Paragraph>{children}</Paragraph>
        {onClose && <span css={crossPlaceholderStyles}> </span>}
      </div>
    </div>
  </section>
);

export default Toast;
