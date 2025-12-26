import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import Toggle from '../Toggle';

const props: ComponentProps<typeof Toggle> = {
  leftButtonIcon: <svg />,
  leftButtonText: 'Left Text',
  rightButtonIcon: <svg />,
  rightButtonText: 'Right Text',
};

it('renders a toggle with labels', () => {
  const { getByText } = render(
    <Toggle
      {...props}
      leftButtonText="Left Text"
      rightButtonText="Right Text"
    />,
  );
  expect(getByText('Left Text')).toBeVisible();
  expect(getByText('Right Text')).toBeVisible();
});

it('renders a toggle with icons', () => {
  const { getByTitle } = render(
    <Toggle
      {...props}
      leftButtonIcon={
        <svg>
          <title>Left Icon</title>
        </svg>
      }
      rightButtonIcon={
        <svg>
          <title>Right Icon</title>
        </svg>
      }
    />,
  );
  expect(getByTitle('Left Icon')).toBeInTheDocument();
  expect(getByTitle('Right Icon')).toBeInTheDocument();
});

it('changes the toggle position', () => {
  const { getByText, rerender } = render(
    <Toggle
      {...props}
      leftButtonText="Left Text"
      rightButtonText="Right Text"
    />,
  );
  expect(getByText('Left Text')).toBeChecked();
  expect(getByText('Right Text')).not.toBeChecked();

  rerender(<Toggle {...props} position="right" />);
  expect(getByText('Left Text')).not.toBeChecked();
  expect(getByText('Right Text')).toBeChecked();
});

it('fires the change event', async () => {
  const handleChange = jest.fn();
  const { getByText } = render(<Toggle {...props} onChange={handleChange} />);
  expect(handleChange.mock.calls.length).toBe(0);

  await userEvent.click(getByText('Right Text'));
  expect(handleChange.mock.calls.length).toBe(1);
});
