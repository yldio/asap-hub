import React from 'react';
import { render } from '@testing-library/react';

import ErrorCard from '../ErrorCard';

jest.useFakeTimers('modern');

it('renders a plain message', () => {
  const { getByText } = render(<ErrorCard title="oops" description="" />);
  expect(getByText('oops')).toBeVisible();
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
    const { getByRole, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = getByRole('figure').textContent;

    rerender(<ErrorCard error={makeDeterministicError()} />);
    const errorInfo2 = getByRole('figure').textContent;

    expect(errorInfo2).toEqual(errorInfo1);
  });

  it('includes the error name in the error info', () => {
    const { getByRole, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = getByRole('figure').textContent;

    rerender(
      <ErrorCard
        error={Object.assign(makeDeterministicError(), {
          name: 'SpecialError',
        })}
      />,
    );
    const errorInfo2 = getByRole('figure').textContent;

    expect(errorInfo2).not.toEqual(errorInfo1);
  });

  it('includes the error stack in the error info', () => {
    const { getByRole, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = getByRole('figure').textContent;

    rerender(
      <ErrorCard
        error={Object.assign(makeDeterministicError(), {
          stack: 'Error at somewhere else',
        })}
      />,
    );
    const errorInfo2 = getByRole('figure').textContent;

    expect(errorInfo2).not.toEqual(errorInfo1);
  });

  it('includes a timestamp in the error info', () => {
    const { getByRole, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = getByRole('figure').textContent;

    jest.advanceTimersByTime(1000);
    rerender(<ErrorCard error={makeDeterministicError()} />);
    const errorInfo2 = getByRole('figure').textContent;

    expect(errorInfo2).not.toEqual(errorInfo1);
  });

  it('includes the document head in the error info', () => {
    const { getByRole, rerender } = render(
      <ErrorCard error={makeDeterministicError()} />,
    );
    const errorInfo1 = getByRole('figure').textContent;

    const extraHeadElement = document.head.appendChild(
      document.createElement('style'),
    );
    rerender(<ErrorCard error={makeDeterministicError()} />);
    extraHeadElement.remove();
    const errorInfo2 = getByRole('figure').textContent;

    expect(errorInfo2).not.toEqual(errorInfo1);
  });
});
