import React, { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { noop } from '../utils';
import { LabeledCheckbox } from '../molecules';

export interface Option<V extends string> {
  value: V;
  label: string;
  disabled?: boolean;
}

interface CheckboxGroupProps<V extends string> {
  readonly options: ReadonlyArray<Option<V>>;

  readonly values: V[];
  readonly onChange?: (newValue: V) => void;
}
export default function CheckboxGroup<V extends string>({
  options,

  values,
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
          disabled={option.disabled}
          checked={values.includes(option.value)}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </>
  );
}
