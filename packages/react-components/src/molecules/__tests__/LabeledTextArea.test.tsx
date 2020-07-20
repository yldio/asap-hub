import React from 'react';
import { render } from '@testing-library/react';

import LabeledTextArea from '../LabeledTextArea';

it('renders a labeled text area, passing through props', () => {
  const { getByLabelText } = render(
    <LabeledTextArea title="Title" value="val" />,
  );
  expect(getByLabelText('Title')).toHaveValue('val');
});
