import { css } from '@emotion/react';

import { rem } from '../pixels';
import { fern, lead, paper, pine, steel } from '../colors';
import { noop } from '../utils';

const styles = css({
  boxSizing: 'border-box',
  width: rem(24),
  height: rem(24),
  marginRight: rem(12),

  appearance: 'none',
  outline: 'none',
  // outer ring
  borderRadius: '12px',
  borderStyle: 'solid',
  borderWidth: rem(1),
  borderColor: steel.rgb,
  // inner circle
  padding: rem(6),
  backgroundClip: 'content-box',
  backgroundColor: paper.rgb,

  ':disabled': {
    borderColor: steel.rgb,
    ':hover, :focus': {
      borderColor: steel.rgb,
    },
  },

  ':hover, :focus': {
    borderColor: lead.rgb,
  },
  ':checked': {
    borderColor: fern.rgb,
    backgroundColor: fern.rgb,

    ':hover, :focus': {
      borderColor: pine.rgb,
      backgroundColor: pine.rgb,
    },
  },
});

interface RadioButtonProps {
  readonly id?: string;
  readonly groupName: string;

  readonly checked?: boolean;
  readonly disabled?: boolean;
  readonly onSelect?: () => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  groupName,

  checked = false,
  disabled = false,
  onSelect = noop,
}) => (
  <input
    type="radio"
    id={id}
    name={groupName}
    checked={checked}
    onChange={() => !disabled && onSelect()}
    css={styles}
    disabled={disabled}
  />
);

export default RadioButton;
