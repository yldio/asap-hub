import React from 'react';
import { render, waitFor } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import Frame from '../Frame';

mockConsoleError();

const Throw: React.FC<{}> = () => {
  throw new Error('oops');
};
const Suspend = React.lazy(() => new Promise(() => {}));

it('catches errors', () => {
  const { container } = render(
    <Frame>
      <Throw />
    </Frame>,
  );
  expect(container).toHaveTextContent(/error/i);
});

it('provides a suspense fallback', async () => {
  const { container } = render(
    <Frame>
      <Suspend />
    </Frame>,
  );
  await waitFor(() => expect(container).toHaveTextContent(/loading/i));
});
