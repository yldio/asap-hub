import React, { ComponentProps } from 'react';
import { css } from '@emotion/react';

import { rem } from '../pixels';
import { validationMessageStyles } from '../form';
import { CheckboxGroup } from '../organisms';

export type LabeledCheckboxGroupProps = ComponentProps<typeof CheckboxGroup> & {
  readonly title?: string;
  readonly subtitle?: string;
  readonly validationMessage?: string;
};

const containerStyles = css({
  border: 'none',
  margin: 0,
  padding: `${rem(18)} 0`,
});

const subtitleStyles = css({
  paddingLeft: rem(6),
});

export default function LabeledCheckboxGroup({
  title,
  subtitle,
  validationMessage,
  ...checkboxGroupProps
}: LabeledCheckboxGroupProps): ReturnType<React.FC> {
  return (
    <fieldset css={containerStyles}>
      {title || subtitle ? (
        <legend>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
        </legend>
      ) : null}

      <CheckboxGroup {...checkboxGroupProps} />
      {validationMessage && (
        <div css={validationMessageStyles}>{validationMessage}</div>
      )}
    </fieldset>
  );
}
