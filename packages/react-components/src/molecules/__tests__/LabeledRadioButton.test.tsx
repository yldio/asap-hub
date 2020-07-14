import React from 'react';
import { render } from '@testing-library/react';

import LabeledRadioButton from '../LabeledRadioButton';

it('renders a labeled radio button, passing through props', () => {
  const { getByLabelText } = render(
    <LabeledRadioButton groupName="Airport" title="Heathrow" checked />,
  );
  expect(getByLabelText('Heathrow')).toBeChecked();
});
