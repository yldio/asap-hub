import { css } from '@emotion/react';

import { RadioButtonGroup, RadioButtonGroupProps } from '../organisms';
import { perRem } from '../pixels';

type LabeledRadioButtonGroupProps<V extends string> = {
  readonly title?: React.ReactNode;
  readonly subtitle?: React.ReactNode;
} & RadioButtonGroupProps<V>;

const containerStyles = css({
  border: 'none',
  margin: 0,
  padding: `${18 / perRem}em 0`,
});

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

export default function LabeledRadioButtonGroup<V extends string>({
  title,
  subtitle,
  ...radioButtonGroupProps
}: LabeledRadioButtonGroupProps<V>): ReturnType<React.FC> {
  return (
    <fieldset css={containerStyles}>
      <legend>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span>
      </legend>
      <RadioButtonGroup {...radioButtonGroupProps} />
    </fieldset>
  );
}
