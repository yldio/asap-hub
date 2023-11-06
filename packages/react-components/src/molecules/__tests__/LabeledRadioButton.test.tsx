import { render, screen } from '@testing-library/react';

import LabeledRadioButton from '../LabeledRadioButton';

jest.mock('uuid', () => ({ v4: () => '12' }));

it('renders a labeled radio button, passing through props', () => {
  const { getByLabelText } = render(
    <LabeledRadioButton groupName="Airport" title="Heathrow" checked />,
  );
  expect(getByLabelText('Heathrow')).toBeChecked();
});

describe('tooltip', () => {
  beforeEach(() => {
    render(
      <LabeledRadioButton
        groupName="Airport"
        title="Heathrow"
        disabled
        tooltipText="Tooltip"
      />,
    );
  });

  it('has title attribute', async () => {
    expect(screen.getByTestId('label-12')).toHaveAttribute('title', 'Tooltip');
  });
});
