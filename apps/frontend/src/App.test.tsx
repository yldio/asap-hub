import React from 'react';
import { render } from '@testing-library/react';
import App from './App';

test('renders asap link', () => {
  const { getByText } = render(<App />);
  const linkElement = getByText(/aligning science/i);
  expect(linkElement).toBeInTheDocument();
});
