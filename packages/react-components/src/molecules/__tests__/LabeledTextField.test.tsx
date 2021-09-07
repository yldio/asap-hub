import { render } from '@testing-library/react';

import LabeledTextField from '../LabeledTextField';
import { lead } from '../../colors';

it('renders a labeled text field, passing through props', () => {
  const { getByLabelText } = render(
    <LabeledTextField title="Title" subtitle="Subtitle" value="val" />,
  );

  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Subtitle/i)).toBeVisible();
  expect(getByLabelText(/Title/i)).toHaveValue('val');
});

it('renders the title in bold font', () => {
  const { getByText } = render(
    <LabeledTextField title="Title" subtitle="Required" value="" />,
  );
  expect(getComputedStyle(getByText('Title')).fontWeight).toMatchInlineSnapshot(
    `"bold"`,
  );
});

it('renders a greyed out description', () => {
  const { getByText } = render(
    <LabeledTextField title="Title" description="Description" value="" />,
  );
  expect(getComputedStyle(getByText('Description')).color).toBe(lead.rgb);
});

it('renders a greyed out hint', () => {
  const { getByText } = render(
    <LabeledTextField title="Title" hint="Hint" value="" />,
  );
  expect(getComputedStyle(getByText('Hint')).color).toBe(lead.rgb);
});
