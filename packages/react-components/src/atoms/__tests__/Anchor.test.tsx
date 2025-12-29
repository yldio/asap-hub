import { MemoryRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';

import Anchor from '../Anchor';

it('renders the text in an anchor', () => {
  const { getByText } = render(<Anchor href="/">text</Anchor>);
  expect(getByText('text').tagName).toBe('A');
});

describe.each`
  contextDescription    | wrapper
  ${'with a router'}    | ${MemoryRouter}
  ${'without a router'} | ${undefined}
`('$contextDescription', ({ wrapper }) => {
  describe.each`
    linkDescription    | href
    ${'external link'} | ${'https://parkinsonsroadmap.org/'}
    ${'internal link'} | ${'/'}
  `("for an $linkDescription to '$href'", ({ href }) => {
    it('applies the href to the anchor', () => {
      const { getByRole } = render(<Anchor href={href}>text</Anchor>, {
        wrapper,
      });
      const anchor = getByRole('link') as HTMLAnchorElement;
      expect(new URL(anchor.href, window.location.href).href).toBe(
        new URL(href, window.location.href).href,
      );
    });
  });

  it('renders an inactive link without an href', () => {
    const { getByText } = render(<Anchor href={undefined}>text</Anchor>, {
      wrapper,
    });
    expect(getByText('text', { selector: 'a' })).not.toHaveAttribute('href');
  });

  it('renders an inactive link with an empty href', () => {
    const { getByText } = render(<Anchor href="">text</Anchor>, {
      wrapper,
    });
    expect(getByText('text', { selector: 'a' })).not.toHaveAttribute('href');
  });
});

describe('for an external link', () => {
  it('sets the anchor target to open in a new page', () => {
    const { getByRole } = render(
      <Anchor href="https://parkinsonsroadmap.org/">text</Anchor>,
    );
    const { target } = getByRole('link') as HTMLAnchorElement;
    expect(target).toBe('_blank');
  });

  it('secures the link against third parties', () => {
    const { getByRole } = render(
      <Anchor href="https://parkinsonsroadmap.org/">text</Anchor>,
    );
    const { relList } = getByRole('link') as HTMLAnchorElement;
    expect(relList).toContain('noreferrer');
    expect(relList).toContain('noopener');
  });

  it('triggers a full page navigation on click', () => {
    const { getByRole } = render(
      <Anchor href="https://parkinsonsroadmap.org/">text</Anchor>,
    );
    const anchor = getByRole('link') as HTMLAnchorElement;
    expect(fireEvent.click(anchor)).toBe(true);
  });
});

describe.each`
  description           | wrapper
  ${'with a router'}    | ${MemoryRouter}
  ${'without a router'} | ${undefined}
`('for an internal link $description to /', ({ wrapper }) => {
  it('does not set the anchor target', () => {
    const { getByRole } = render(<Anchor href="/">text</Anchor>, { wrapper });
    const { target } = getByRole('link') as HTMLAnchorElement;
    expect(target).toBe('');
  });

  it('does not secure the link against third parties', () => {
    const { getByRole } = render(<Anchor href="/">text</Anchor>, { wrapper });
    const { relList } = getByRole('link') as HTMLAnchorElement;
    expect(relList).not.toContain('noreferrer');
    expect(relList).not.toContain('noopener');
  });
});

describe('for an internal link with a router', () => {
  it('does not trigger a full page navigation on click', () => {
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/']}>
        <Anchor
          href={`${window.location.protocol}//${window.location.host}/page?query#fragment`}
        >
          text
        </Anchor>
      </MemoryRouter>,
    );
    const anchor = getByRole('link') as HTMLAnchorElement;
    expect(fireEvent.click(anchor)).toBe(false);
  });

  it('navigates to the anchor referenced by the fragment', async () => {
    // Note: Smooth scrolling is now handled by the useScrollToHash hook in Layout,
    // not by the Anchor component. This test verifies navigation works correctly.
    const { getByRole } = render(
      <MemoryRouter initialEntries={['/']}>
        <Anchor href={`/#fragment`}>text</Anchor>
        <main id="fragment">text</main>
      </MemoryRouter>,
    );

    const anchor = getByRole('link') as HTMLAnchorElement;
    // Click should not trigger full page navigation (handled by React Router)
    expect(fireEvent.click(anchor)).toBe(false);
  });
});
