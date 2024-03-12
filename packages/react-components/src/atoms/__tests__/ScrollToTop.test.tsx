import { render, waitFor } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom/server';
import ScrollToTop from '../ScrollToTop';

beforeEach(() => {
  window.scrollTo = jest.fn();
});

it('should call scroll to top on mount', async () => {
  render(
    <StaticRouter>
      <ScrollToTop />
    </StaticRouter>,
  );
  await waitFor(() => expect(window.scrollTo).toHaveBeenCalledWith(0, 0));
});
