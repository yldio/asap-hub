import { css, Theme } from '@emotion/react';
import { renderToStaticMarkup } from 'react-dom/server';

import { perRem } from '../pixels';
import { fern, lead, pine, steel } from '../colors';
import { noop } from '../utils';
import { tickIcon } from '../icons';

const checkboxStyles = ({
  primary500 = fern,
  primary900 = pine,
}: Theme['colors'] = {}) =>
  css({
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

    ':enabled:hover, :enabled:focus': {
      borderColor: lead.rgb,
    },
    ':checked': {
      borderColor: primary500.rgba,
      backgroundColor: primary500.rgba,
      '::before': {
        content: `url(data:image/svg+xml;utf8,${encodeURIComponent(
          renderToStaticMarkup(tickIcon),
        )})`,
        display: 'flex',
        justifyContent: 'center',
        lineHeight: `${24 / perRem}em`,
      },

      ':hover, :focus': {
        borderColor: primary900.rgba,
        backgroundColor: primary900.rgba,
      },
    },
  });

interface CheckboxProps {
  readonly id?: string;
  readonly groupName: string;
  readonly enabled?: boolean;
  readonly checked?: boolean;
  readonly onSelect?: () => void;
}
const Checkbox: React.FC<CheckboxProps> = ({
  id,
  groupName,
  enabled = true,
  checked = false,
  onSelect = noop,
}) => (
  <input
    id={id}
    name={groupName}
    checked={checked}
    disabled={!enabled}
    onChange={() => onSelect()}
    css={({ colors }) => checkboxStyles(colors)}
    type="checkbox"
  />
);

export default Checkbox;
