import React, { useEffect, useContext } from 'react';
import { render } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import { ToastContext } from '../toast';

mockConsoleError();

const OneToast: React.FC<Record<string, never>> = () => {
  const toast = useContext(ToastContext);
  useEffect(() => {
    toast('error');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

it('rejects toasts when there is no provider to display them', () => {
  expect(() => render(<OneToast />)).toThrow(/toast/i);
});
