import { css } from '@emotion/react';
import { ComponentProps, ReactNode } from 'react';
import { MultiSelect, Paragraph, Label } from '../atoms';
import AsyncMultiSelect from '../atoms/AsyncMultiSelect';
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
type SyncLabeledMultiSelectProps = {
  isAsync?: false;
} & LabeledMultiSelectProps &
  Exclude<ComponentProps<typeof MultiSelect>, 'id'>;
type AsyncLabeledMultiSelectProps = {
  isAsync: true;
} & LabeledMultiSelectProps &
  ComponentProps<typeof AsyncMultiSelect>;
const LabeledMultiSelect: React.FC<
  SyncLabeledMultiSelectProps | AsyncLabeledMultiSelectProps
> = ({
  title,
  subtitle,
  description,
  isAsync = false,
  ...multiSelectProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label
      forContent={(id) =>
        isAsync ? (
          <AsyncMultiSelect
            {...(multiSelectProps as AsyncLabeledMultiSelectProps)}
            id={id}
          />
        ) : (
          <MultiSelect
            {...(multiSelectProps as SyncLabeledMultiSelectProps)}
            id={id}
          />
        )
      }
    >
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
