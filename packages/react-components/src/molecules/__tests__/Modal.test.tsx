import React from 'react';
import { render } from '@testing-library/react';

import Modal from '../Modal';

it('renders children', () => {
  const { container } = render(<Modal>test123</Modal>);
  expect(container.textContent).toEqual('test123');
});
