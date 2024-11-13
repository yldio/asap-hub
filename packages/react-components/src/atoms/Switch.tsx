import { css, Theme } from '@emotion/react';
import { fern, steel } from '../colors';
import { noop } from '../utils';

const toggleStyles = ({ primary500 = fern }: Theme['colors'] = {}) =>
  css({
    position: 'relative',
    width: '40px',
    height: '20px',
    appearance: 'none',
    backgroundColor: steel.rgb,
    borderRadius: '10px',
    outline: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s',

    '::before': {
      content: '""',
      position: 'absolute',
      top: '2px',
      left: '2px',
      width: '16px',
      height: '16px',
      backgroundColor: '#fff',
      borderRadius: '50%',
      transition: 'transform 0.2s',
    },

    ':checked': {
      backgroundColor: primary500.rgba,
      '::before': {
        transform: 'translateX(20px)',
      },
    },

    ':disabled': {
      backgroundColor: steel.rgb,
      cursor: 'not-allowed',
      opacity: 0.6,
      '::before': {
        backgroundColor: steel.rgb,
      },
    },
  });

export type SwitchProps = {
  readonly id?: string;
  readonly enabled?: boolean;
  readonly checked?: boolean;
  readonly onClick?: () => void;
  readonly ariaLabel?: string;
};

const Switch: React.FC<SwitchProps> = ({
  id,
  enabled = true,
  checked = false,
  onClick = noop,
  ariaLabel = 'Toggle switch',
}) => (
  <input
    id={id}
    aria-checked={checked}
    aria-label={ariaLabel}
    type="checkbox"
    checked={checked}
    disabled={!enabled}
    onChange={onClick}
    css={({ colors }) => toggleStyles(colors)}
  />
);

export default Switch;
