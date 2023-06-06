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
    position: 'absolute',
    left: 0,
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

  clipPath: `polygon(
    0 0,
    0 calc(100% - ${triangleHeight / perRem}em),
    calc(50% - ${4.5 / perRem}em) calc(100% - ${triangleHeight / perRem}em),
    50% 100%,
    calc(50% + ${4.5 / perRem}em) calc(100% - ${triangleHeight / perRem}em),
    100% calc(100% - ${triangleHeight / perRem}em),
    100% 0
  )`,

  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    width: '100vw',
    transform: 'none',
    left: 0,
    clipPath: 'none',
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

const presentationStyles = css({
  [`@media (max-width: ${tabletScreen.width - 1}px)`]: {
    display: 'none',
  },
});

interface TooltipProps {
  children: ReactNode;
  shown?: boolean;
}
const Tooltip: React.FC<TooltipProps> = ({ children, shown = false }) => (
  <span css={positionerStyles}>
    <span css={[tooltipStyles, shown || { display: 'none' }]}>
      <span role="tooltip" css={bubbleStyles}>
        {children}
      </span>
      <span role="presentation" css={[themes.dark, presentationStyles]} />
    </span>
  </span>
);

export default Tooltip;
