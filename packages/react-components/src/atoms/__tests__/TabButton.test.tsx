import { render } from '@testing-library/react';
import TabButton from '../TabButton';

it('renders a TabButton', () => {
  const { getByText, rerender, getByRole } = render(
    <TabButton>Tab Title</TabButton>,
  );
  expect(getByText('Tab Title')).toBeVisible();

  rerender(<TabButton disabled>Tab Title</TabButton>);
  expect(getByRole('button', { name: 'Tab Title' })).toBeDisabled();
});

it('renders the active button as bold', () => {
  const { getByRole } = render(<TabButton active>Target</TabButton>);
  expect(getByRole('button', { name: 'Target' })).toHaveStyleRule(
    'font-weight',
    'bold',
  );
});
