import { useEffect, useContext } from 'react';
import { render, getByTitle } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ToastContext } from '@asap-hub/react-context';

import ToastStack from '../ToastStack';

const TwoToasts: React.FC<Record<string, never>> = () => {
  const toast = useContext(ToastContext);
  useEffect(() => {
    toast('t1');
    toast('t2');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
};

it('renders the children', () => {
  const { container } = render(<ToastStack>content</ToastStack>);
  expect(container).toHaveTextContent('content');
});

it('adds toast messages in order', () => {
  const { getByRole } = render(
    <ToastStack>
      <TwoToasts />
    </ToastStack>,
  );
  expect(getByRole('list')).toHaveTextContent(/t1.*t2/);
});

it('can close toast messages', () => {
  const { getByText, getByRole } = render(
    <ToastStack>
      <TwoToasts />
    </ToastStack>,
  );
  userEvent.click(getByTitle(getByText('t1').closest('li')!, /close/i));
  expect(getByRole('list')).toHaveTextContent('t2');
  expect(getByRole('list')).not.toHaveTextContent('t1');
});

it('clears the stack when passing null', () => {
  const ResetStack: React.FC<Record<string, never>> = () => {
    const toast = useContext(ToastContext);
    useEffect(() => {
      toast('t1');
      toast('t2');
      toast(null);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    return null;
  };
  const { getByRole } = render(
    <ToastStack>
      <ResetStack />
    </ToastStack>,
  );
  expect(getByRole('list').children).toHaveLength(0);
});
