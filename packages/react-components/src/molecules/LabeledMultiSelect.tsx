import { css } from '@emotion/react';
import { ComponentProps, ReactNode } from 'react';
import { MultiSelect, Paragraph, Label } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
});

type LabeledMultiSelectProps = {
  readonly title: ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: ReactNode;
};
export type SyncLabeledMultiSelectProps = LabeledMultiSelectProps &
  Exclude<ComponentProps<typeof MultiSelect>, 'id'>;

const LabeledMultiSelect: React.FC<SyncLabeledMultiSelectProps> = ({
  title,
  subtitle,
  description,
  ...multiSelectProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <MultiSelect {...multiSelectProps} id={id} />}>
      <Paragraph>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span>
        <br />
        <span css={descriptionStyles}>{description}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledMultiSelect;
