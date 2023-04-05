import { FC } from 'react';
import { render, screen } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import Frame from '../Frame';

mockConsoleError();

const Throw: FC<Record<string, never>> = () => {
  throw new Error('oops');
};

describe('an error', () => {
  it('renders gp2 contact email', () => {
    render(
      <Frame title={null}>
        <Throw />
      </Frame>,
    );
    expect(screen.getByRole('link')).toHaveAttribute(
      'href',
      expect.stringContaining('techsupport@gp2.org'),
    );
  });
});
