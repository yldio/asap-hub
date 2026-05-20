import { render, fireEvent, screen } from '@testing-library/react';

import LabeledDateInput from '../LabeledDateInput';

it('renders a labeled date field, with the string', () => {
  render(<LabeledDateInput title="Date" value={'2020-01-01'} />);
  expect(screen.getByLabelText('Date')).toHaveAttribute('type', 'date');
  expect(screen.getByLabelText('Date')).toHaveValue('2020-01-01');
});

it('renders an empty date field', () => {
  render(<LabeledDateInput title="Date" />);
  expect(screen.getByLabelText('Date')).toHaveValue('');
});

it('renders a labeled date field, passing through props', () => {
  render(
    <LabeledDateInput
      title="Publish Date"
      subtitle="('required')"
      description={'Please enter a date before today'}
    />,
  );
  expect(screen.getByText(/publish date/i)).toBeVisible();
  expect(screen.getByText(/required/i)).toBeVisible();
  expect(screen.getByText(/please enter a date before today/i)).toBeVisible();
});

it('reports changes as date objects', async () => {
  const handleChange = jest.fn<void, [string | undefined]>();
  render(
    <LabeledDateInput
      title="Date"
      value={'2020-01-01'}
      onChange={handleChange}
    />,
  );
  fireEvent.change(screen.getByLabelText('Date'), {
    target: { value: '2019-02-01' },
  });

  expect(handleChange).toHaveBeenCalled();
  const [newDate] = handleChange.mock.calls.slice(-1)[0]!;
  expect(newDate).toBe('2019-02-01');
});

it('handles clearing the date field', () => {
  const handleChange = jest.fn<void, [string | undefined]>();

  render(
    <LabeledDateInput
      title="Date"
      value={'2020-01-01'}
      onChange={handleChange}
    />,
  );

  fireEvent.change(screen.getByLabelText('Date'), {
    target: { value: '' },
  });

  expect(handleChange).toHaveBeenCalled();

  const [newDate] = handleChange.mock.calls.slice(-1)[0]!;
  expect(newDate).toBe('');
});
