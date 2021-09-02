import { render } from '@testing-library/react';

import LabeledTypeahead from '../LabeledTypeahead';

it('renders a labeled dropdown, passing through props', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <LabeledTypeahead
      title="Title"
      subtitle="Subtitle"
      suggestions={['Value']}
      value="Value"
    />,
  );

  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Subtitle/i)).toBeVisible();
  expect(getByDisplayValue('Value')).toBeVisible();
});
