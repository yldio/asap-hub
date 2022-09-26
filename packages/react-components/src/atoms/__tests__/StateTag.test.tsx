import { render, screen } from '@testing-library/react';

import StateTag from '../StateTag';

it('renders a tag label with content', () => {
  const { container } = render(<StateTag label="Text" />);
  expect(container.textContent).toEqual('Text');
});

it('renders an icon if provided', () => {
  const testSvg = (
    <svg>
      <title>Icon</title>
    </svg>
  );
  render(<StateTag label="Text" icon={testSvg} />);
  expect(screen.getByTitle('Icon')).toBeInTheDocument();
});
