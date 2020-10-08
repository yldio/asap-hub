import React from 'react';
import { render } from '@testing-library/react';

import LabeledCheckbox from '../LabeledCheckbox';

it('renders a labeled checkbox, passing through props', () => {
  const { getByLabelText } = render(
    <LabeledCheckbox title="Accept" groupName="group" checked />,
  );
  expect(getByLabelText('Accept')).toBeChecked();
});
