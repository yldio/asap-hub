import { useQuery } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';

import {
  createTestQueryClient,
  TestQueryClientWrapper,
} from '../test-query-client';

const Probe = () => {
  const { data } = useQuery({
    queryKey: ['probe'],
    queryFn: async () => 'ok',
  });
  return <span>{data ?? 'pending'}</span>;
};

describe('TestQueryClientWrapper', () => {
  it('provides a working QueryClient context', async () => {
    render(
      <TestQueryClientWrapper>
        <Probe />
      </TestQueryClientWrapper>,
    );
    await waitFor(() => expect(screen.getByText('ok')).toBeInTheDocument());
  });

  it('accepts an injected client', async () => {
    const client = createTestQueryClient();
    render(
      <TestQueryClientWrapper client={client}>
        <Probe />
      </TestQueryClientWrapper>,
    );
    await waitFor(() => expect(screen.getByText('ok')).toBeInTheDocument());
  });
});
