import { render } from '@testing-library/react';

import LabeledDropdown from '../LabeledDropdown';

it('renders a labeled dropdown, passing through props', () => {
  const { getByText, getByLabelText } = render(
    <LabeledDropdown
      title="Title"
      subtitle="Optional"
      options={[{ value: 'val', label: 'Value' }]}
      value="val"
    />,
  );

  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Optional/i)).toBeVisible();
  expect(getByText('Value')).toBeVisible();
});
