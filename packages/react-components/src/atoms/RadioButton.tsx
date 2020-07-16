import React from 'react';
import css from '@emotion/css';

import { perRem } from '../pixels';
import { fern, steel, paper, lead, pine } from '../colors';
import { noop } from '../utils';

const styles = css({
  boxSizing: 'border-box',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  marginRight: `${12 / perRem}em`,
  marginTop: `${12 / perRem}em`,
  marginBottom: `${12 / perRem}em`,

  appearance: 'none',
  outline: 'none',
  // outer ring
  borderRadius: '12px',
  borderStyle: 'solid',
  borderWidth: `${1 / perRem}em`,
  borderColor: steel.rgb,
  // inner circle
  padding: `${6 / perRem}em`,
  backgroundClip: 'content-box',
  backgroundColor: paper.rgb,

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
  readonly onSelect?: () => void;
}
const RadioButton: React.FC<RadioButtonProps> = ({
  id,
  groupName,

  checked = false,
  onSelect = noop,
}) => (
  <input
    type="radio"
    id={id}
    name={groupName}
    checked={checked}
    onChange={() => onSelect()}
    css={styles}
  />
);

export default RadioButton;
