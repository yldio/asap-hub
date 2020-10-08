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
} & Exclude<ComponentProps<typeof Checkbox>, 'id'>;

const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  title,
  enabled = true,
  ...checkboxProps
}) => (
  <div css={[containerStyles, enabled || disabledStyles]}>
    <Label
      trailing
      forContent={(id) => (
        <Checkbox {...checkboxProps} enabled={enabled} id={id} />
      )}
    >
      <Paragraph>{title}</Paragraph>
    </Label>
  </div>
);

export default LabeledCheckbox;
