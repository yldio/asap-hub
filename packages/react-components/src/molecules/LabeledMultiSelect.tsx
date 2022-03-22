import { css } from '@emotion/react';
import { ReactElement, ReactNode } from 'react';
import { MultiSelect, Paragraph, Label } from '../atoms';
import { MultiSelectOptionType, MultiSelectProps } from '../atoms/MultiSelect';
import { lead } from '../colors';
import { perRem } from '../pixels';

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
});

export type LabeledMultiSelectProps<T extends MultiSelectOptionType> = {
  readonly title: ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: ReactNode;
} & Exclude<MultiSelectProps<T>, 'id'>;

const LabeledMultiSelect = <T extends MultiSelectOptionType>({
  title,
  subtitle,
  description,
  ...multiSelectProps
}: LabeledMultiSelectProps<T>): ReactElement => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label
      forContent={(id) => <MultiSelect<T> {...multiSelectProps} id={id} />}
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
