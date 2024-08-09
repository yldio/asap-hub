import { render, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';

beforeEach(() => {
  window.scrollTo = jest.fn();
});

it('should call scroll to top on mount', async () => {
  render(
    <MemoryRouter>
      <ScrollToTop />
    </MemoryRouter>,
  );
  await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith(0, 0));
});
