import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';

import Link from '../Link';
import { fern, paper } from '../../colors';

describe.each`
  description                         | href                                | wrapper
  ${'external link'}                  | ${'https://parkinsonsroadmap.org/'} | ${undefined}
  ${'internal link with a router'}    | ${'/'}                              | ${StaticRouter}
  ${'internal link without a router'} | ${'/'}                              | ${undefined}
`('for an $description to $href', ({ href, wrapper }) => {
  it('renders the text in an anchor', () => {
    const { getByText } = render(<Link href={href}>text</Link>, {
      wrapper,
    });
    expect(getByText('text').tagName).toBe('A');
  });

  it('applies the default link color', () => {
    const { getByRole } = render(<Link href={href}>text</Link>, {
      wrapper,
    });
    const { color } = getComputedStyle(getByRole('link'));
    expect(color).toBe(fern.rgb);
  });

  it('respects the white prop', () => {
    const { getByRole } = render(
      <Link white href={href}>
        text
      </Link>,
      { wrapper },
    );
    const { color } = getComputedStyle(getByRole('link'));
    expect(color).toBe(paper.rgb);
  });

  it('respects the underline prop', () => {
    const { getByRole, rerender } = render(<Link href={href}>text</Link>, {
      wrapper,
    });

    const { textDecoration: textDecorationUnderline } = getComputedStyle(
      getByRole('link'),
    );
    expect(textDecorationUnderline).toEqual('underline');

    rerender(
      <Link underline={false} href={href}>
        text
      </Link>,
    );

    const { textDecoration } = getComputedStyle(getByRole('link'));
    expect(textDecoration).toMatchInlineSnapshot(`"none"`);
  });

  it('applies the href to the anchor', () => {
    const { getByRole } = render(<Link href={href}>text</Link>, {
      wrapper,
    });
    const anchor = getByRole('link') as HTMLAnchorElement;
    expect(anchor).toHaveAttribute('href', href);
  });
});

describe('for an external link', () => {
  it('sets the anchor target to open in a new page', () => {
    const { getByRole } = render(
      <Link href="https://parkinsonsroadmap.org/">text</Link>,
    );
    const { target } = getByRole('link') as HTMLAnchorElement;
    expect(target).toBe('_blank');
  });

  it('secures the link against third parties', () => {
    const { getByRole } = render(
      <Link href="https://parkinsonsroadmap.org/">text</Link>,
    );
    const { relList } = getByRole('link') as HTMLAnchorElement;
    expect(relList).toContain('noreferrer');
    expect(relList).toContain('noopener');
  });
});

describe.each`
  description           | wrapper
  ${'with a router'}    | ${StaticRouter}
  ${'without a router'} | ${undefined}
`('for an internal link $description to /', ({ wrapper }) => {
  it('does not set the anchor target', () => {
    const { getByRole } = render(<Link href="/">text</Link>, { wrapper });
    const { target } = getByRole('link') as HTMLAnchorElement;
    expect(target).toBe('');
  });

  it('does not secure the link against third parties', () => {
    const { getByRole } = render(<Link href="/">text</Link>, { wrapper });
    const { relList } = getByRole('link') as HTMLAnchorElement;
    expect(relList).not.toContain('noreferrer');
    expect(relList).not.toContain('noopener');
  });
});

describe.each`
  description                         | href
  ${'external link'}                  | ${`https://parkinsonsroadmap.org/`}
  ${'external link'}                  | ${`//parkinsonsroadmap.org/`}
  ${'external link'}                  | ${`//${window.location.hostname}:${Number(window.location.port || 80) - 1}/`}
  ${'internal link without a router'} | ${`/`}
`('for an $description to $href', ({ href }) => {
  it('triggers a full page navigation on click', () => {
    const { getByRole } = render(<Link href={href}>text</Link>);
    const anchor = getByRole('link') as HTMLAnchorElement;
    expect(fireEvent.click(anchor)).toBe(true);
  });
});

describe.each([
  `${window.location.protocol}//${window.location.host}`,
  `${window.location.protocol}//${window.location.host}/page`,
  `//${window.location.host}`,
  `//${window.location.host}/page`,
  `/`,
  `/page`,
  `.`,
  `./page`,
  `..`,
  `../page`,
  `page`,
  `#`,
  `#fragment`,
  `?query`,
  `${window.location.protocol}//${window.location.host}/page?query#fragment`,
])('for an internal link with a router to %s', (href: string) => {
  it('does not trigger a full page navigation on click', () => {
    const { getByRole } = render(<Link href={href}>text</Link>, {
      wrapper: StaticRouter,
    });
    const anchor = getByRole('link') as HTMLAnchorElement;
    expect(fireEvent.click(anchor)).toBe(false);
  });
});
