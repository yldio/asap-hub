import { css, Theme } from '@emotion/react';
import { error500, fern, neutral800, pearl, steel } from '../colors';
import { mobileScreen } from '../pixels';
import { noop } from '../utils';

export type SwitchSize = 'default' | 'large';

// Geometry per size; the knob travel is the box width minus the knob and both
// insets, so it stays consistent if the box is resized.
const sizes = {
  default: {
    width: '40px',
    height: '20px',
    borderRadius: '10px',
    knobSize: '16px',
    knobTop: '2px',
    knobLeft: '2px',
    knobColor: '#fff',
    travel: '20px',
  },
  large: {
    width: '51px',
    height: '24px',
    borderRadius: '15px',
    knobSize: '17.55px',
    knobTop: '3px',
    knobLeft: '2.68px',
    knobColor: pearl.rgb,
    travel: '27.82px',
  },
} as const;

// The larger toggle shrinks on mobile, where the attendee rows have less room.
const largeMobileGeometry = {
  width: '35px',
  height: '16.47px',
  borderRadius: '10.2941px',
  knobSize: '12.04px',
  knobTop: '2.06px',
  knobLeft: '1.84px',
  travel: '19.09px',
} as const;

const toggleStyles = (
  uncheckedColor: 'default' | 'error',
  size: SwitchSize,
  { primary500 = fern }: Theme['colors'] = {},
) => {
  const geometry = sizes[size];
  const isLarge = size === 'large';
  return css({
    position: 'relative',
    width: geometry.width,
    height: geometry.height,
    flexShrink: 0,
    appearance: 'none',
    backgroundColor: uncheckedColor === 'error' ? error500.rgb : steel.rgb,
    // The larger toggle draws a border when checked; declaring it transparent
    // at rest (with border-box sizing) keeps the box and the knob from moving.
    ...(isLarge
      ? { boxSizing: 'border-box' as const, border: '1px solid transparent' }
      : {}),
    borderRadius: geometry.borderRadius,
    outline: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',

    '::before': {
      content: '""',
      position: 'absolute',
      top: geometry.knobTop,
      left: geometry.knobLeft,
      width: geometry.knobSize,
      height: geometry.knobSize,
      backgroundColor: geometry.knobColor,
      borderRadius: '50%',
      transition: 'transform 0.2s',
    },

    ':checked': {
      backgroundColor: primary500.rgba,
      ...(isLarge ? { borderColor: primary500.rgba } : {}),
      '::before': {
        transform: `translateX(${geometry.travel})`,
      },
    },

    ':disabled': {
      backgroundColor: neutral800.rgb,
      ...(isLarge ? { borderColor: neutral800.rgb } : {}),
      cursor: 'not-allowed',
      '::before': {
        backgroundColor: geometry.knobColor,
      },
    },

    ...(isLarge
      ? {
          [`@media (max-width: ${mobileScreen.max}px)`]: {
            width: largeMobileGeometry.width,
            height: largeMobileGeometry.height,
            borderRadius: largeMobileGeometry.borderRadius,
            '::before': {
              top: largeMobileGeometry.knobTop,
              left: largeMobileGeometry.knobLeft,
              width: largeMobileGeometry.knobSize,
              height: largeMobileGeometry.knobSize,
            },
            ':checked::before': {
              transform: `translateX(${largeMobileGeometry.travel})`,
            },
          },
        }
      : {}),
  });
};

export type SwitchProps = {
  readonly id?: string;
  readonly enabled?: boolean;
  readonly checked?: boolean;
  readonly onClick?: () => void;
  readonly ariaLabel?: string;
  readonly uncheckedColor?: 'default' | 'error';
  readonly size?: SwitchSize;
};

const Switch: React.FC<SwitchProps> = ({
  id,
  enabled = true,
  checked = false,
  onClick = noop,
  ariaLabel = 'Toggle switch',
  uncheckedColor = 'default',
  size = 'default',
}) => (
  <input
    id={id}
    aria-checked={checked}
    aria-label={ariaLabel}
    type="checkbox"
    checked={checked}
    disabled={!enabled}
    onChange={onClick}
    css={({ colors }) => toggleStyles(uncheckedColor, size, colors)}
  />
);

export default Switch;
