import { render } from '@testing-library/react';

import LabeledMultiSelect from '../LabeledMultiSelect';

it('renders a labeled multi select, passing through props', () => {
  const { getByText, getByLabelText } = render(
    <LabeledMultiSelect
      title="Title"
      subtitle="Subtitle"
      suggestions={['Value']}
      values={['Value']}
    />,
  );
  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Subtitle/i)).toBeVisible();
  expect(getByText('Value')).toBeVisible();
});
