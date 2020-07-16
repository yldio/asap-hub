import React from 'react';
import { formatISO } from 'date-fns';
import { render, fireEvent } from '@testing-library/react';

import LabeledDateField from '../LabeledDateField';

it('renders a labeled date field, with the stringified value', () => {
  const { getByLabelText } = render(
    <LabeledDateField title="Date" value={new Date('2020-01-01T12:34:56')} />,
  );
  expect(getByLabelText('Date')).toHaveAttribute('type', 'date');
  expect(getByLabelText('Date')).toHaveValue('2020-01-01');
});

it('renders an empty date field', () => {
  const { getByLabelText } = render(<LabeledDateField title="Date" />);
  expect(getByLabelText('Date')).toHaveValue('');
});

it('reports changes as date objects', async () => {
  const handleChange = jest.fn<void, [Date]>();
  const { getByLabelText } = render(
    <LabeledDateField
      title="Date"
      value={new Date('2020-01-01')}
      onChange={handleChange}
    />,
  );
  fireEvent.change(getByLabelText('Date'), {
    target: { value: '2019-02-01' },
  });

  expect(handleChange).toHaveBeenCalled();
  const [newDate] = handleChange.mock.calls.slice(-1)[0];
  expect(formatISO(newDate, { representation: 'date' })).toBe('2019-02-01');
});
