import { useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';

import { Option } from '../select';
import { noop } from '../utils';
import { LabeledRadioButton } from '../molecules';

interface RadioButtonGroupProps<V extends string> {
  readonly options: ReadonlyArray<Option<V>>;

  readonly value: V;
  readonly onChange?: (newValue: V) => void;
}
export default function RadioButtonGroup<V extends string>({
  options,

  value,
  onChange = noop,
}: RadioButtonGroupProps<V>): ReturnType<React.FC> {
  const groupName = useRef(uuidV4());
  return (
    <>
      {options.map((option) => (
        <LabeledRadioButton
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
