import { render } from '@testing-library/react';

import LabeledTypeahead from '../LabeledTypeahead';

it('renders a labeled dropdown, passing through props', () => {
  const { getByDisplayValue, getByLabelText } = render(
    <LabeledTypeahead title="Title" suggestions={['Value']} value="Value" />,
  );
  expect(getByLabelText('Title')).toBeVisible();
  expect(getByDisplayValue('Value')).toBeVisible();
});
