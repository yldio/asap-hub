import { render } from '@testing-library/react';

import LabeledTextArea from '../LabeledTextArea';
import { lead } from '../../colors';

it('renders a labeled text area, passing through props', () => {
  const { getByLabelText } = render(
    <LabeledTextArea title="Title" value="val" />,
  );
  expect(getByLabelText('Title')).toHaveValue('val');
});

it('renders a greyed out tip', () => {
  const { getByText } = render(
    <LabeledTextArea title="Title" tip="Tip" value="val" />,
  );
  expect(getComputedStyle(getByText('Tip')).color).toBe(lead.rgb);
});
