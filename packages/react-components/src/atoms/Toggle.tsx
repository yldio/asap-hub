import React from 'react';
import css from '@emotion/css';
import { lineHeight, perRem } from '../pixels';
import { steel, paper, tin, charcoal } from '../colors';

const checkboxLabelStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 40px 1fr',
  height: `${54 / perRem}em`,
  borderRadius: '27px',
  border: `1px solid ${steel.rgb}`,
  overflow: 'hidden',
  backgroundColor: steel.rgb,
  color: tin.rgb,
  stroke: tin.rgb,
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
  color: charcoal.rgb,
  stroke: charcoal.rgb,
});
const checkboxStyles = css({
  display: 'none',
  '&:not(:checked) ~ .left': activeStyles,
  '&:checked ~ .right': activeStyles,
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
  onChange: () => void;
}

const Toggle: React.FC<ToggleProps> = ({
  position = 'left',
  leftButtonIcon,
  leftButtonText,
  rightButtonIcon,
  rightButtonText,
  onChange,
}) => (
  <label css={checkboxLabelStyles}>
    <input
      type="checkbox"
      checked={position === 'left'}
      css={checkboxStyles}
      onChange={onChange}
    ></input>
    <div className="left" css={[buttonStyle, buttonLeft]}>
      <span css={iconStyles}>{leftButtonIcon}</span>
      {leftButtonText}
    </div>
    <div className="right" css={[buttonStyle, buttonRight]}>
      <span css={iconStyles}>{rightButtonIcon}</span>
      {rightButtonText}
    </div>
  </label>
);

export default Toggle;
