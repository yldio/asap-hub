import { ReactNode } from 'react';
import { css } from '@emotion/react';

import { themes } from '../theme';
import { perRem, tabletScreen } from '../pixels';

const triangleHeight = 5;

const positionerStyles = css({
  display: 'block',
  position: 'relative',
  height: 0,
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    position: 'relative',
    width: '100%',
  },
});
const tooltipStyles = css({
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: `${256 / perRem}em`,

  display: 'grid',
  gridTemplateRows: `auto ${triangleHeight / perRem}em`,

  '::before': {
    content: '""',
    display: 'block',
    width: 0,
    height: 0,
    position: 'absolute',
    borderLeft: `${triangleHeight}px solid transparent`,
    borderRight: `${triangleHeight}px solid transparent`,
    borderTop: `${triangleHeight}px solid #000`,
    bottom: 0,
    right: '50%',
    marginRight: `-${triangleHeight / 2}px`,
  },

  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    width: 'max-content',
  },
});
const bubbleStyles = css({
  ...themes.dark,
  display: 'block',

  padding: `${9 / perRem}em ${12 / perRem}em`,
  boxSizing: 'border-box',
  maxWidth: `${256 / perRem}em`,

  borderRadius: `${4 / perRem}em`,

  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    maxWidth: '100%',
    marginLeft: `${12 / perRem}em`,
    marginRight: `${12 / perRem}em`,
  },
});

interface TooltipProps {
  children: ReactNode;
  shown?: boolean;
  maxContent?: boolean;
  bottom?: string;
}
const Tooltip: React.FC<TooltipProps> = ({
  children,
  shown = false,
  maxContent = false,
  bottom,
}) => (
  <span css={positionerStyles}>
    <span
      css={[
        tooltipStyles,
        shown || { display: 'none' },
        maxContent && { width: 'max-content' },
        bottom && { bottom },
      ]}
    >
      <span
        role="tooltip"
        css={[
          bubbleStyles,
          maxContent && { width: 'max-content', maxWidth: 'fit-content' },
        ]}
      >
        {children}
      </span>
    </span>
  </span>
);

export default Tooltip;
