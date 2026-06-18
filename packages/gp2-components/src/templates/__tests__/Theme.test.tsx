import { render, screen } from '@testing-library/react';
import Theme from '../Theme';

it('renders children with data-app="gp2" attribute', () => {
  render(
    <Theme>
      <span>content</span>
    </Theme>,
  );
  expect(screen.getByText('content').closest('[data-app="gp2"]')).toBeTruthy();
});
