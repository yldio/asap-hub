import React, { ComponentProps, useRef } from 'react';
import { v4 as uuidV4 } from 'uuid';
import { css } from '@emotion/react';

import { Option } from '../select';
import { noop } from '../utils';
import { LabeledRadioButton } from '.';
import { mobileScreen, perRem } from '../pixels';
import { validationMessageStyles } from '../form';

export type LabeledRadioButtonGroupProps<V extends string> = {
  readonly title?: string;
  readonly subtitle?: string;
  readonly options: ReadonlyArray<Option<V>>;
  readonly validationMessage?: string;

  readonly value: V;
  readonly onChange?: (newValue: V) => void;
} & Pick<ComponentProps<typeof LabeledRadioButton>, 'tooltipText'>;

const optionListStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr 1fr 1fr',
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    gridTemplateColumns: '1fr',
  },
});

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
  options,
  value,
  onChange = noop,
  tooltipText,
  validationMessage,
}: LabeledRadioButtonGroupProps<V>): ReturnType<React.FC> {
  const groupName = useRef(uuidV4());
  return (
    <fieldset css={containerStyles}>
      {title || subtitle ? (
        <legend>
          <strong>{title}</strong>
          <span css={subtitleStyles}>{subtitle}</span>
        </legend>
      ) : null}
      <div css={optionListStyles}>
        {options.map((option) => (
          <LabeledRadioButton
            key={option.value}
            disabled={option.disabled}
            groupName={groupName.current}
            title={option.label}
            checked={option.value === value}
            onSelect={() => onChange(option.value)}
            tooltipText={option.disabled ? tooltipText : undefined}
          />
        ))}
      </div>
      {validationMessage && (
        <div css={validationMessageStyles}>{validationMessage}</div>
      )}
    </fieldset>
  );
}
