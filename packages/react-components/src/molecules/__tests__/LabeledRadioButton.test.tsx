import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

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
        hasTooltip
        tooltipText="Tooltip"
      />,
    );
  });
  it('renders tooltip when exists and is disabled', async () => {
    expect(screen.getByText(/tooltip/i)).toBeInTheDocument();
    expect(screen.getByText(/tooltip/i)).not.toBeVisible();
  });
  it('shows and hides on hover/unhover', () => {
    userEvent.hover(screen.getByTestId('label-12'));

    expect(screen.getByText(/tooltip/i)).toBeVisible();

    userEvent.unhover(screen.getByTestId('label-12'));

    expect(screen.getByText(/tooltip/i)).not.toBeVisible();
  });
});
