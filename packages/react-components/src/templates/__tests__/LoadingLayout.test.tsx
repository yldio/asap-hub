import { render, screen } from '@testing-library/react';

import LoadingLayout from '../LoadingLayout';

it('renders the asap logo', async () => {
  render(<LoadingLayout />);
  expect(screen.getByTitle('ASAP Logo')).toBeInTheDocument();
});
