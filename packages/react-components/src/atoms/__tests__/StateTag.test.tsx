import { render, screen } from '@testing-library/react';

import StateTag from '../StateTag';

it('renders a tag label with content', () => {
  const { container } = render(<StateTag label="Text" />);
  expect(container.textContent).toEqual('Text');
});

it('renders an icon if provided', () => {
  render(<StateTag label="Text" icon={<span data-testid="icon">icon</span>} />);
  expect(screen.getByTestId('icon')).toBeInTheDocument();
});
