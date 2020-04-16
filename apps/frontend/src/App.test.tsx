import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders react link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/react/i);
  expect(linkElement).toBeInTheDocument();
});
