import { ComponentProps } from 'react';
import { css } from '@emotion/react';

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
  readonly wrapLabel?: boolean;
} & Exclude<ComponentProps<typeof Checkbox>, 'id'>;

const LabeledCheckbox: React.FC<LabeledCheckboxProps> = ({
  title,
  enabled = true,
  wrapLabel = true,
  ...checkboxProps
}) => (
  <div css={[containerStyles, enabled || disabledStyles]}>
    <Label
      trailing
      wrapLabel={wrapLabel}
      forContent={(id) => (
        <Checkbox {...checkboxProps} enabled={enabled} id={id} />
      )}
    >
      <Paragraph>{title}</Paragraph>
    </Label>
  </div>
);

export default LabeledCheckbox;
