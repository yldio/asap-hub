import React, { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { css } from '@emotion/react';

import { Option } from '../select';
import { noop } from '../utils';
import { LabeledRadioButton } from '../molecules';
import { mobileScreen } from '../pixels';

export interface RadioButtonGroupProps<V extends string> {
  readonly options: ReadonlyArray<Option<V>>;

  readonly value: V;
  readonly onChange?: (newValue: V) => void;
}

const containerStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  [`@media (max-width: ${mobileScreen.min}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

export default function RadioButtonGroup<V extends string>({
  options,

  value,
  onChange = noop,
}: RadioButtonGroupProps<V>): ReturnType<React.FC> {
  const groupName = useRef(uuidV4());
  return (
    <div css={containerStyles}>
      {options.map((option) => (
        <LabeledRadioButton
          key={option.value}
          groupName={groupName.current}
          title={option.label}
          checked={option.value === value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </div>
  );
}
