import { css } from '@emotion/react';
import { format, formatISO, parseISO } from 'date-fns';
import { ComponentProps } from 'react';

import { Label, Paragraph, TextField } from '../atoms';
import { lead } from '../colors';
import { perRem } from '../pixels';
import { noop } from '../utils';

type LabeledDateFieldProps = {
  readonly title: React.ReactNode;
  readonly subtitle?: React.ReactNode;
  readonly description?: React.ReactNode;

  readonly enabled?: boolean;
  readonly value?: Date;
  readonly max?: Date;
  readonly onChange?: (newDate: Date | undefined) => void;
} & Pick<
  ComponentProps<typeof TextField>,
  'required' | 'customValidationMessage' | 'getValidationMessage'
>;

const subtitleStyles = css({
  paddingLeft: `${6 / perRem}em`,
});

const descriptionStyles = css({
  color: lead.rgb,
});

export const parseDateToString = (date?: Date): string => {
  try {
    if (date) {
      return formatISO(date, { representation: 'date' });
    }
    throw new Error('Date is undefined');
  } catch {
    return '';
  }
};

const LabeledDateField: React.FC<LabeledDateFieldProps> = ({
  title,
  subtitle,
  description,

  max,
  value,
  onChange = noop,
  ...dateFieldProps
}) => (
  <div css={{ paddingBottom: `${18 / perRem}em` }}>
    <Label
      forContent={(id) => (
        <TextField
          {...dateFieldProps}
          type="date"
          id={id}
          value={parseDateToString(value)}
          onChange={(newDate) => onChange(parseISO(newDate))}
          max={max ? format(max, 'yyyy-MM-dd') : undefined}
        />
      )}
    >
      <Paragraph>
        <strong>{title}</strong>
        <span css={subtitleStyles}>{subtitle}</span> <br />
        <span css={descriptionStyles}>{description}</span>
      </Paragraph>
    </Label>
  </div>
);
export default LabeledDateField;
