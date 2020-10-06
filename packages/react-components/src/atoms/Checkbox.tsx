import React from 'react';
import css from '@emotion/css';
import { renderToStaticMarkup } from 'react-dom/server';

import { perRem } from '../pixels';
import { fern, lead, pine, steel } from '../colors';
import { noop } from '../utils';
import { tickIcon } from '../icons';

const checkboxStyles = css({
  boxSizing: 'border-box',
  width: `${24 / perRem}em`,
  height: `${24 / perRem}em`,
  marginRight: `${12 / perRem}em`,
  marginTop: `${12 / perRem}em`,
  marginBottom: `${12 / perRem}em`,

  appearance: 'none',
  outline: 'none',
  borderRadius: 0,
  borderStyle: 'solid',
  borderWidth: `${1 / perRem}em`,
  borderColor: steel.rgb,

  ':enabled:hover, :focus': {
    borderColor: lead.rgb,
  },
  ':checked': {
    borderColor: fern.rgb,
    backgroundColor: fern.rgb,
    ':before': {
      content: `url(data:image/svg+xml;utf8,${encodeURIComponent(
        renderToStaticMarkup(tickIcon),
      )})`,
      display: 'flex',
      justifyContent: 'center',
      lineHeight: `${24 / perRem}em`,
    },

    ':hover, :focus': {
      borderColor: pine.rgb,
      backgroundColor: pine.rgb,
    },
  },
});

interface CheckboxProps {
  readonly id?: string;
  readonly groupName: string;
  readonly disabled: boolean;
  readonly checked?: boolean;
  readonly onSelect?: () => void;
}
const Checkbox: React.FC<CheckboxProps> = ({
  id,
  groupName,

  disabled,
  checked = false,
  onSelect = noop,
}) => (
  <>
    <input
      id={id}
      name={groupName}
      checked={checked}
      disabled={disabled}
      onChange={() => onSelect()}
      css={checkboxStyles}
      type="checkbox"
    />
  </>
);

export default Checkbox;
