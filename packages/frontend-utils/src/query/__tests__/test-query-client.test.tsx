import { useQueryClient } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';

import {
  createTestQueryClient,
  TestQueryClientWrapper,
} from '../test-query-client';

describe('createTestQueryClient', () => {
  it('never retries, never goes stale, never garbage-collects', () => {
    expect(createTestQueryClient().getDefaultOptions()).toEqual({
      queries: { retry: false, staleTime: Infinity, gcTime: Infinity },
      mutations: { retry: false },
    });
  });
});

describe('TestQueryClientWrapper', () => {
  const ShowSeededGreeting: React.FC = () => {
    const client = useQueryClient();
    return <p>{String(client.getQueryData(['greeting']))}</p>;
  };

  it('provides the given client to children', () => {
    const client = createTestQueryClient();
    client.setQueryData(['greeting'], 'hello');

    render(
      <TestQueryClientWrapper client={client}>
        <ShowSeededGreeting />
      </TestQueryClientWrapper>,
    );
    expect(screen.getByText('hello')).toBeVisible();
  });

  it('falls back to a fresh client when none is given', () => {
    render(
      <TestQueryClientWrapper>
        <ShowSeededGreeting />
      </TestQueryClientWrapper>,
    );
    expect(screen.getByText('undefined')).toBeVisible();
  });
});
