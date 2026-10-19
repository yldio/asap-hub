import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/react';

import { colour } from '../colors';
import { rem, tabletScreen } from '../pixels';
import { fontStyles } from '../text';

const triangleHeight = 4;

const positionerStyles = css({
  display: 'block',
  position: 'relative',
  height: 0,
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    width: '100%',
  },
});
const tooltipStyles = css({
  '--tooltip-background': colour.foreground['color-blue'],
  position: 'absolute',
  left: '50%',
  transform: 'translateX(-50%)',
  width: rem(256),

  display: 'block',
  paddingBottom: rem(triangleHeight),

  '::before': {
    content: '""',
    display: 'block',
    width: 0,
    height: 0,
    position: 'absolute',
    borderLeft: `${triangleHeight}px solid transparent`,
    borderRight: `${triangleHeight}px solid transparent`,
    borderTop: `${triangleHeight}px solid var(--tooltip-background)`,
    bottom: 0,
    right: '50%',
    // the triangle is 2 * triangleHeight wide, so pull it right by half
    // its width to center its tip on the bubble midline
    marginRight: `-${triangleHeight}px`,
  },

  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    maxWidth: `calc(100vw - ${rem(48)})`,
  },
});
const bottomTooltipStyles = css({
  paddingTop: rem(triangleHeight),
  paddingBottom: 0,

  '::before': {
    borderTop: 'none',
    borderBottom: `${triangleHeight}px solid var(--tooltip-background)`,
    top: 0,
    bottom: 'auto',
  },
});
const bubbleStyles = css({
  backgroundColor: 'var(--tooltip-background)',
  color: colour.foreground['primary-inverse'],
  display: 'block',

  padding: rem(12),
  boxSizing: 'border-box',

  borderRadius: rem(8),

  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    maxWidth: '100%',
  },
});

const bubbleTextStyles = css({
  display: 'block',
  fontFamily: `'Nunito Sans', ${fontStyles.fontFamily}`,
  fontSize: rem(14),
  lineHeight: 24 / 14,
});

interface TooltipProps {
  children: ReactNode;
  shown?: boolean;
  position?: 'top' | 'bottom';
  maxContent?: boolean;
  offset?: string | number;
  textStyles?: SerializedStyles;
  width?: string | number;
  // Recolours the bubble and its tail together; the tail is drawn by a
  // pseudo-element that no style prop can reach from the outside.
  background?: string;
}
const Tooltip: React.FC<TooltipProps> = ({
  children,
  shown = false,
  position = 'top',
  maxContent = false,
  offset = position === 'top' ? 0 : rem(4),
  textStyles,
  width,
  background,
}) => {
  const widthValue = typeof width === 'number' ? rem(width) : width ?? rem(256);

  return (
    <span css={positionerStyles}>
      <span
        css={[
          tooltipStyles,
          position === 'bottom' && bottomTooltipStyles,
          { width: widthValue },
          position === 'top' ? { bottom: offset } : { top: offset },
          background && { '--tooltip-background': background },
          shown || { display: 'none' },
          maxContent && { width: 'max-content' },
        ]}
      >
        <span
          role="tooltip"
          css={[
            bubbleStyles,
            { maxWidth: widthValue },
            maxContent && { width: 'max-content', maxWidth: 'fit-content' },
            textStyles,
          ]}
        >
          <span css={bubbleTextStyles}>{children}</span>
        </span>
      </span>
    </span>
  );
};

export default Tooltip;
