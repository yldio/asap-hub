import { css } from '@emotion/react';
import { ReactElement, ReactNode } from 'react';
import {
  MultiSelect,
  MultiSelectProps,
  MultiSelectOptionsType,
  Paragraph,
  Label,
} from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
});

export type LabeledMultiSelectProps<
  T extends MultiSelectOptionsType,
  M extends boolean = true,
> = {
  readonly title: ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: ReactNode;
} & Exclude<MultiSelectProps<T, M>, 'id'>;

const LabeledMultiSelect = <
  T extends MultiSelectOptionsType,
  M extends boolean = true,
>({
  title,
  subtitle,
  description,
  ...multiSelectProps
}: LabeledMultiSelectProps<T, M>): ReactElement => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label forContent={(id) => <MultiSelect {...multiSelectProps} id={id} />}>
      <Paragraph noMargin>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span>
        <br />
        <span css={descriptionStyles}>{description}</span>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledMultiSelect;
