import React from 'react';
import { render } from '@testing-library/react';

import LabeledDropdown from '../LabeledDropdown';

it('renders a labeled dropdown, passing through props', () => {
  const { getByText, getByLabelText } = render(
    <LabeledDropdown
      title="Title"
      options={[{ value: 'val', label: 'Value' }]}
      value="val"
    />,
  );
  expect(getByLabelText('Title')).toBeVisible();
  expect(getByText('Value')).toBeVisible();
});
