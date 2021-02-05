import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import Frame from '../Frame';

mockConsoleError();

const Throw: React.FC<Record<string, never>> = () => {
  throw new Error('oops');
};
const Suspend = React.lazy(() => new Promise(() => {}));

it('catches errors', () => {
  const { container } = render(
    <Frame>
      <Throw />
    </Frame>,
  );
  expect(container).toHaveTextContent(/went wrong/i);
});

it('Passes through error boundary  props', () => {
  const { container } = render(
    <Frame boundaryProps={{ description: 'specificerror' }}>
      <Throw />
    </Frame>,
  );
  expect(container).toHaveTextContent(/specificerror/i);
});

it('provides a default suspense fallback', async () => {
  const { container } = render(
    <Frame>
      <Suspend />
    </Frame>,
  );
  await waitFor(() => expect(container).toHaveTextContent(/loading/i));
});

it('passes through a suspense fallback', async () => {
  const { container } = render(
    <Frame fallback={'123'}>
      <Suspend />
    </Frame>,
  );
  await waitFor(() => expect(container).toHaveTextContent('123'));
});
