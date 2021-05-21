import { css } from '@emotion/react';
import { lineHeight, perRem } from '../pixels';
import { steel, paper, tin, charcoal, lead, silver } from '../colors';
import { noop } from '../utils';

const styles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 20px 1fr',
  height: `${54 / perRem}em`,

  minWidth: `${240 / perRem}em`,
  borderRadius: '27px',
  backgroundColor: silver.rgb,
  color: tin.rgb,
  cursor: 'pointer',
  svg: {
    stroke: tin.rgb,
  },
});

const buttonStyle = css({
  borderRadius: '27px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

const iconStyles = css({
  display: 'inline-block',
  width: `${lineHeight / perRem}em`,
  height: `${lineHeight / perRem}em`,
  paddingRight: `${6 / perRem}em`,
});
const activeStyles = css({
  backgroundColor: paper.rgb,
  border: `1px solid ${steel.rgb}`,
  color: charcoal.rgb,
  svg: {
    stroke: lead.rgb,
  },
});
const buttonRight = css({
  gridColumn: '2 / span 2',
  gridRow: 1,
});
const buttonLeft = css({
  gridColumn: '1 / span 2',
  gridRow: 1,
});

interface ToggleProps {
  position?: 'left' | 'right';
  leftButtonText: string;
  leftButtonIcon: React.ReactElement<SVGElement>;
  rightButtonText: string;
  rightButtonIcon: React.ReactElement<SVGElement>;
  onChange?: () => void;
}

const Toggle: React.FC<ToggleProps> = ({
  position = 'left',
  leftButtonIcon,
  leftButtonText,
  rightButtonIcon,
  rightButtonText,
  onChange = noop,
}) => (
  <div css={styles} onClick={onChange} role="radiogroup">
    <div
      css={[buttonStyle, buttonLeft, position === 'left' && activeStyles]}
      role="radio"
      aria-checked={position === 'left'}
    >
      <span css={iconStyles}>{leftButtonIcon}</span>
      {leftButtonText}
    </div>
    <div
      css={[buttonStyle, buttonRight, position === 'right' && activeStyles]}
      role="radio"
      aria-checked={position === 'right'}
    >
      <span css={iconStyles}>{rightButtonIcon}</span>
      {rightButtonText}
    </div>
  </div>
);

export default Toggle;
