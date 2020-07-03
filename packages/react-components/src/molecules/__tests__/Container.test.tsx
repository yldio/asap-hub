import React from 'react';
import { render } from '@testing-library/react';

import Container from '../Container';

it('renders children content', () => {
  const { container } = render(<Container>children</Container>);
  expect(container.textContent).toBe('children');
});
