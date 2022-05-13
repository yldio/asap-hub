import { render, screen } from '@testing-library/react';
import LabeledDropdown from '../LabeledDropdown';

it('renders a labeled dropdown, passing through props', () => {
  render(
    <LabeledDropdown
      title="Title"
      subtitle="Optional"
      description="Description"
      options={[{ value: 'val', label: 'Value' }]}
      value="val"
    />,
  );

  expect(screen.getByRole('textbox', { name: /Title/i })).toBeVisible();
  expect(screen.getByRole('textbox', { name: /Description/i })).toBeVisible();
  expect(screen.getByRole('textbox', { name: /Optional/i })).toBeVisible();
  expect(screen.getByText('Value')).toBeVisible();
});
