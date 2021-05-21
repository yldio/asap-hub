import { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { noop } from '../utils';
import { LabeledCheckbox } from '../molecules';

export interface Option<V extends string> {
  value: V;
  label: string;
  enabled?: boolean;
}

interface CheckboxGroupProps<V extends string> {
  readonly options: ReadonlyArray<Option<V>>;

  readonly values?: ReadonlySet<V>;
  readonly onChange?: (newValue: V) => void;
}
export default function CheckboxGroup<V extends string>({
  options,

  values = new Set(),
  onChange = noop,
}: CheckboxGroupProps<V>): ReturnType<React.FC> {
  const groupName = useRef(uuidV4());
  return (
    <>
      {options.map((option, index) => (
        <LabeledCheckbox
          key={`${groupName}-${index}`}
          groupName={groupName.current}
          title={option.label}
          enabled={option.enabled}
          checked={values.has(option.value)}
          onSelect={() => onChange(option.value)}
        />
      ))}
    </>
  );
}
