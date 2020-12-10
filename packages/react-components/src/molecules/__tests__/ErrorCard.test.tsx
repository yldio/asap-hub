import React from 'react';
import { render } from '@testing-library/react';

import ErrorCard from '../ErrorCard';

jest.useFakeTimers('modern');

it('renders a plain message', () => {
  const { getByText } = render(
    <ErrorCard title="oops" description="went wrong" />,
  );
  expect(getByText('oops')).toBeVisible();
  expect(getByText('went wrong')).toBeVisible();
});

describe('when passed an error', () => {
  it('renders the message', () => {
    const { getByText } = render(<ErrorCard error={new Error('oops')} />);
    expect(getByText('oops')).toBeVisible();
  });

  const makeDeterministicError = () => {
    const err = new Error('oops');
    err.stack = 'Error at some line';
    return err;
  };

  it('renders the same error info for the same error', () => {
    const { container, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = container.textContent;

    rerender(<ErrorCard error={makeDeterministicError()} />);
    const errorInfo2 = container.textContent;

    expect(errorInfo2).toEqual(errorInfo1);
  });

  it('includes the error description', () => {
    const { container, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = container.textContent;

    rerender(
      <ErrorCard
        error={Object.assign(makeDeterministicError(), {
          message: 'Different error',
        })}
      />,
    );
    const errorInfo2 = container.textContent;

    expect(errorInfo2).not.toEqual(errorInfo1);
  });

  it('includes the error stack in the error info', () => {
    const { getByRole, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = getByRole('link').getAttribute('href');

    rerender(
      <ErrorCard
        error={Object.assign(makeDeterministicError(), {
          stack: 'Error at somewhere else',
        })}
      />,
    );
    const errorInfo2 = getByRole('link').getAttribute('href');

    expect(errorInfo2).not.toEqual(errorInfo1);
  });
});
