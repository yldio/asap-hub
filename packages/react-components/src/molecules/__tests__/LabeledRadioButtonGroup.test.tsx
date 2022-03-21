import { render, screen } from '@testing-library/react';

import LabeledRadioButtonGroup from '../LabeledRadioButtonGroup';

it('renders a labeled radio button group, passing through props', () => {
  render(
    <LabeledRadioButtonGroup
      options={[
        { value: 'LHR', label: 'Heathrow' },
        { value: 'LGW', label: 'Gatwick' },
      ]}
      value={'LHR'}
    />,
  );
  expect(screen.getByLabelText('Heathrow')).toBeChecked();
});

it('renders a section title', () => {
  render(<LabeledRadioButtonGroup title="Group title" options={[]} value="" />);
  expect(screen.getByText(/Group title/i)).toBeVisible();
});

it('renders a section subtitle', () => {
  render(
    <LabeledRadioButtonGroup
      subtitle="Group description"
      options={[]}
      value=""
    />,
  );
  expect(screen.getByText(/Group description/i)).toBeVisible();
});
