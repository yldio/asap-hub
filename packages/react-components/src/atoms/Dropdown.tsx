import { FC } from 'react';
import Select, { OptionTypeBase } from 'react-select';
import { css } from '@emotion/react';

import { noop } from '../utils';
import { validationMessageStyles } from '../form';
import { dropdownChevronIcon } from '../icons';
import { Option, reactSelectStyles } from '../select';

const containerStyles = css({
  flexBasis: '100%',
});
const DropdownIndicator: FC = () => dropdownChevronIcon;

export interface DropdownProps<V extends string> {
  readonly customValidationMessage?: string;

  readonly id?: string;
  readonly options: ReadonlyArray<Option<V>>;
  readonly enabled?: boolean;

  readonly value: V;
  readonly onChange?: (newValue: V) => void;
}
export default function Dropdown<V extends string>({
  customValidationMessage = '',

  id,
  options,
  enabled = true,

  value,
  onChange = noop,
}: DropdownProps<V>): ReturnType<FC> {
  return (
    <div css={containerStyles}>
      <Select<OptionTypeBase>
        inputId={id}
        isDisabled={!enabled}
        options={options.filter((option) => option.value !== '')}
        value={options.find((option) => option.value === value)}
        onChange={(option) => {
          onChange((option as Option<V>).value);
        }}
        components={{ DropdownIndicator }}
        styles={reactSelectStyles(!!customValidationMessage)}
      />
      <div css={validationMessageStyles}>{customValidationMessage}</div>
    </div>
  );
}
