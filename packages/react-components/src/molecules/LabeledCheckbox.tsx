import React, { ComponentProps } from 'react';
import css from '@emotion/css';

import { Label, Paragraph, Checkbox } from '../atoms';
import { lead, tin } from '../colors';

const containerStyles = css({
  color: lead.rgb,
});

const disabledStyles = css({
  color: tin.rgb,
});

type LabeledCheckboxProps = {
  readonly title: React.ReactNode;
  readonly groupName: string;
} & Exclude<ComponentProps<typeof Checkbox>, 'id'>;

const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  title,
  groupName,
  disabled = false,
  ...checkboxProps
}) => (
  <div css={[containerStyles, !disabled || disabledStyles]}>
    <Label
      trailing
      forContent={(id) => (
        <Checkbox
          groupName={groupName}
          {...checkboxProps}
          disabled={disabled}
          id={id}
        />
      )}
    >
      <Paragraph>{title}</Paragraph>
    </Label>
  </div>
);

export default LabeledCheckbox;
