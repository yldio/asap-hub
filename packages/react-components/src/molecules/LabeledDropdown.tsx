import React from 'react';

import { Dropdown, Paragraph, Label, DropdownProps } from '../atoms';

type LabeledDropdownProps<V extends string> = {
  readonly title: React.ReactText | ReadonlyArray<React.ReactText>;
} & Exclude<DropdownProps<V>, 'id'>;
export default function LabeledDropdown<V extends string>({
  title,
  ...dropdownProps
}: LabeledDropdownProps<V>) {
  return (
    <Label forContent={(id) => <Dropdown {...dropdownProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
      </Paragraph>
    </Label>
  );
}

// TODO test
