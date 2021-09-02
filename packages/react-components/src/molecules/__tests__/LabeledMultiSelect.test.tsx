import { render } from '@testing-library/react';

import LabeledMultiSelect from '../LabeledMultiSelect';

it('renders a labeled multi select, passing through props', () => {
  const { getByText, getByLabelText } = render(
    <LabeledMultiSelect
      title="Title"
      description="Description"
      suggestions={['Value']}
      values={['Value']}
    />,
  );
  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Description/i)).toBeVisible();
  expect(getByText('Value')).toBeVisible();
});
