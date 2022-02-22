import { render } from '@testing-library/react';

import LabeledDropdown from '../LabeledDropdown';

it('renders a labeled dropdown, passing through props', () => {
  const { getByLabelText, getByText } = render(
    <LabeledDropdown
      title="Title"
      subtitle="Optional"
      description="Description"
      options={[{ value: 'val', label: 'Value' }]}
      value="val"
    />,
  );

  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByText(/Description/i)).toBeVisible();
  expect(getByLabelText(/Optional/i)).toBeVisible();
  expect(getByLabelText(/Title/i)).toHaveValue('Value');
});
