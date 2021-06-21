import { css } from '@emotion/react';
import { ComponentProps, ReactNode } from 'react';
import { MultiSelect, Paragraph, Label } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';

const subtitleStyles = css({
  color: lead.rgb,
});

type LabeledMultiSelectProps = {
  readonly title: ReactNode;
  readonly subtitle?: ReactNode;
} & Exclude<ComponentProps<typeof MultiSelect>, 'id'>;
const LabeledMultiSelect: React.FC<LabeledMultiSelectProps> = ({
  title,
  subtitle,
  ...multiSelectProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <MultiSelect {...multiSelectProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <br />
        <span css={subtitleStyles}>{subtitle}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledMultiSelect;
