import React from 'react';
import css from '@emotion/css';
import { lineHeight, perRem } from '../pixels';
import { steel, paper, tin, charcoal } from '../colors';
const checkboxLabelStyles = css({
  display: 'flex',
  height: '54px',
  borderRadius: '27px',
  border: `1px solid ${steel.rgb}`,
  overflow: 'hidden',
  backgroundColor: steel.rgb,
  color: tin.rgb,
  g: {
    stroke: tin.rgb,
  },
});

const buttonStyle = css({
  width: '50%',
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
  g: {
    stroke: charcoal.rgb,
  },
});
const checkboxStyles = css({
  display: 'none',
  '&:not(:checked) ~ .left': activeStyles,
  '&:checked ~ .right': activeStyles,
});
const buttonRight = css({ marginLeft: '-20px', padding: '0 10px' });
const buttonLeft = css({ marginRight: '-20px', padding: '0 10px' });

interface ToggleProps {
  defaultChecked?: boolean;
  leftButtonText: string;
  leftButtonIcon: React.ReactElement<SVGElement>;
  rightButtonText: string;
  rightButtonIcon: React.ReactElement<SVGElement>;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
}
const Toggle: React.FC<ToggleProps> = ({
  defaultChecked = false,
  leftButtonIcon,
  leftButtonText,
  rightButtonIcon,
  rightButtonText,
  onChange,
}) => (
  <label css={checkboxLabelStyles}>
    <input
      type="checkbox"
      defaultChecked={defaultChecked}
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
