import { ComponentProps } from 'react';
import { formatISO, parseISO } from 'date-fns';

import { TextField, Label, Paragraph, FieldTitle } from '../atoms';
import { noop } from '../utils';
import { perRem } from '../pixels';

type LabeledDateFieldProps = {
  readonly title: React.ReactNode;

  readonly value?: Date;
  readonly onChange?: (newDate: Date) => void;
} & Pick<
  ComponentProps<typeof TextField>,
  'required' | 'customValidationMessage'
>;

const LabeledDateField: React.FC<LabeledDateFieldProps> = ({
  title,

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
          value={value ? formatISO(value, { representation: 'date' }) : ''}
          onChange={(newDate) => onChange(parseISO(newDate))}
        />
      )}
    >
      <Paragraph>
        <FieldTitle {...dateFieldProps}>
          <strong>{title}</strong>
        </FieldTitle>
      </Paragraph>
    </Label>
  </div>
);

export default LabeledDateField;
