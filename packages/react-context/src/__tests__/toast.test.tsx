import { useEffect, useContext } from 'react';
import { render } from '@testing-library/react';
import { mockConsoleError } from '@asap-hub/dom-test-utils';

import { ToastContext, InnerToastContext } from '../toast';

mockConsoleError();

type TestProps = {
  inner?: boolean;
};

const OneToast: React.FC<TestProps> = ({ inner = false }) => {
  const toast = inner
    ? useContext(InnerToastContext)
    : useContext(ToastContext);
  useEffect(() => {
    toast('error');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

it('rejects toasts when there is no provider to display them', () => {
  expect(() => render(<OneToast />)).toThrow(/toast/i);
});

it('rejects inner toasts when there is no provider to display them', () => {
  expect(() => render(<OneToast inner />)).toThrow(/toast/i);
});
