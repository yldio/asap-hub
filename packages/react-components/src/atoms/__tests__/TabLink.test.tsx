import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { StaticRouter } from 'react-router-dom';

import TabLink from '../TabLink';

describe.each`
  description           | wrapper
  ${'with a router'}    | ${StaticRouter}
  ${'without a router'} | ${undefined}
`('$description', ({ wrapper }) => {
  it('renders a link with the given text', () => {
    const { getByRole } = render(<TabLink href="/">Text</TabLink>, {
      wrapper,
    });
    expect(getByRole('link')).toHaveTextContent('Text');
  });

  it('renders a link with the given href', () => {
    const { getByRole } = render(<TabLink href="/">Text</TabLink>, {
      wrapper,
    });
    expect(getByRole('link')).toHaveAttribute('href', '/');
  });

  it('renders the current link in bold', () => {
    const { getByText } = render(
      <>
        <TabLink href="/">Target</TabLink>
        <TabLink href="/other">Other</TabLink>
      </>,
      { wrapper },
    );
    expect(getComputedStyle(getByText('Target')).fontWeight).toBe('bold');
    expect(getComputedStyle(getByText('Other')).fontWeight).not.toBe('bold');
  });
});

describe('with a router', () => {
  it('does not trigger a full page navigation on click', () => {
    const { getByRole } = render(
      <StaticRouter>
        <TabLink href="/">Text</TabLink>
      </StaticRouter>,
    );
    expect(fireEvent.click(getByRole('link'))).toBe(false);
  });
});
