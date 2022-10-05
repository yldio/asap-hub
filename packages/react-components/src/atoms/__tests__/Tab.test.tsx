import { render } from '@testing-library/react';
import Tab from '../Tab';

it('renders a Tab with the given text', () => {
  const { getByText } = render(<Tab>Tab Title</Tab>);
  expect(getByText('Tab Title')).toBeVisible();
});
