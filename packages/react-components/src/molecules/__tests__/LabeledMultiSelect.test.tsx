import { render } from '@testing-library/react';

import LabeledMultiSelect from '../LabeledMultiSelect';

it('renders a labeled multi select, passing through props', () => {
  const { getByText, getByLabelText } = render(
    <LabeledMultiSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      suggestions={[{ label: 'Value', value: 'Value' }]}
      values={[{ label: 'Value', value: 'Value' }]}
    />,
  );
  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Subtitle/i)).toBeVisible();
  expect(getByLabelText(/Description/i)).toBeVisible();
  expect(getByText('Value')).toBeVisible();
});
