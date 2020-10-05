import React, { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { Option } from '../select';
import { noop } from '../utils';
import { LabeledCheckbox } from '../molecules';

interface CheckboxGroupProps<V extends string> {
  readonly options: ReadonlyArray<Option<V>>;

  readonly value: V;
  readonly onChange?: (newValue: V) => void;
}
export default function CheckboxGroup<V extends string>({
  options,

  value,
  onChange = noop,
}: CheckboxGroupProps<V>): ReturnType<React.FC> {
  const groupName = useRef(uuidV4());
  return (
    <>
      {options.map((option) => (
        <LabeledCheckbox
          key={option.value}
          groupName={groupName.current}
          title={option.label}
          checked={option.value === value}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </>
  );
}
