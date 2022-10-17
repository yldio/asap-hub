import { render } from '@testing-library/react';
import TabButton from '../TabButton';

it('renders a TabButton', () => {
  const { getByText } = render(<TabButton>Tab Title</TabButton>);
  expect(getByText('Tab Title')).toBeVisible();
});

it('renders a normal TabButton', () => {
  const { getByText } = render(<TabButton>Target</TabButton>);

  expect(getByText('Target')).toBeVisible();
  expect(getByText('Target')).toBeEnabled();
  expect(getByText('Target')).not.toHaveStyleRule('font-weight', 'bold');
});

it('renders a disabled TabButton correctly', () => {
  const { getByText, getByRole } = render(
    <TabButton disabled>Target</TabButton>,
  );

  expect(getByText('Target')).toBeVisible();
  expect(getByRole('button', { name: 'Target' })).toBeDisabled();
  expect(getByRole('button', { name: 'Target' })).not.toHaveStyleRule(
    'font-weight',
    'bold',
  );
});

it('renders an active TabButton correctly', () => {
  const { getByText, getByRole } = render(<TabButton active>Target</TabButton>);

  expect(getByText('Target')).toBeVisible();
  expect(getByRole('button', { name: 'Target' })).toBeEnabled();
  expect(getByRole('button', { name: 'Target' })).toHaveStyleRule(
    'font-weight',
    'bold',
  );
});
