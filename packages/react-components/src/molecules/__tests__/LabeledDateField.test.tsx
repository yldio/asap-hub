import { formatISO, startOfTomorrow } from 'date-fns';
import { render, fireEvent, screen } from '@testing-library/react';

import LabeledDateField, { parseDateToString } from '../LabeledDateField';

it('renders a labeled date field, with the stringified value', () => {
  render(
    <LabeledDateField title="Date" value={new Date('2020-01-01T12:34:56')} />,
  );
  expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
  expect(screen.getByLabelText('Date')).toHaveValue('2020-01-01');
});

it('renders an empty date field', () => {
  render(<LabeledDateField title="Date" />);
  expect(screen.getByLabelText('Date')).toHaveValue('');
});

it('renders a labeled date field, passing through props', () => {
  render(
    <LabeledDateField
      title="Publish Date"
      subtitle="('required')"
      description={'Please enter a date before today'}
    />,
  );
  expect(screen.getByText(/publish date/i)).toBeVisible();
  expect(screen.getByText(/required/i)).toBeVisible();
  expect(screen.getByText(/please enter a date before today/i)).toBeVisible();
});

it('supports max date attribute', () => {
  render(
    <LabeledDateField
      title="Date"
      value={new Date()}
      max={startOfTomorrow()}
      customValidationMessage="ups"
    />,
  );

  expect(screen.getByText(/ups/i)).toBeVisible();
});

it('reports changes as date objects', async () => {
  const handleChange = jest.fn<void, [Date]>();
  render(
    <LabeledDateField
      title="Date"
      value={new Date('2020-01-01')}
      onChange={handleChange}
    />,
  );
  fireEvent.change(screen.getByLabelText('Date'), {
    target: { value: '2019-02-01' },
  });

  expect(handleChange).toHaveBeenCalled();
  const [newDate] = handleChange.mock.calls.slice(-1)[0];
  expect(formatISO(newDate, { representation: 'date' })).toBe('2019-02-01');
});

describe('Tests that the parseDateTostring function returns', () => {
  it('an empty string when the date is undefined', () => {
    expect(parseDateToString(undefined)).toBe('');
  });
  it('the stringified date when the date is defined', () => {
    expect(parseDateToString(new Date('2020-01-01'))).toBe('2020-01-01');
  });
});
