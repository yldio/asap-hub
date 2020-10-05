import React from 'react';
import { StaticRouter } from 'react-router-dom';
import { render, fireEvent } from '@testing-library/react';

import Link from '../Link';
import { fern, paper } from '../../colors';

it('renders the text in an anchor', () => {
  const { getByText } = render(<Link href="/">text</Link>);
  expect(getByText('text').tagName).toBe('A');
});

describe('the default theme', () => {
  it('applies the default link color', () => {
    const { getByRole } = render(<Link href="/">text</Link>);
    const { color } = getComputedStyle(getByRole('link'));
    expect(color).toBe(fern.rgb);
  });

  it('applies an underline', () => {
    const { getByRole } = render(<Link href="/">text</Link>);
    const { textDecoration } = getComputedStyle(getByRole('link'));
    expect(textDecoration).toBe('underline');
  });
});

describe('the dark theme', () => {
  it('applies the white color', () => {
    const { getByRole } = render(
      <Link href="/" theme="dark">
        text
      </Link>,
    );
    const { color } = getComputedStyle(getByRole('link'));
    expect(color).toBe(paper.rgb);
  });

  it('applies an underline', () => {
    const { getByRole } = render(
      <Link href="/" theme="dark">
        text
      </Link>,
    );
    const { textDecoration } = getComputedStyle(getByRole('link'));
    expect(textDecoration).toBe('underline');
  });
});

describe('no theme', () => {
  it('applies no color', () => {
    const { getByRole } = render(
      <Link href="/" theme={null}>
        text
      </Link>,
    );
    const { color } = getComputedStyle(getByRole('link'));
    expect(color).toBe('');
  });

  it('does not apply an underline', () => {
    const { getByRole } = render(
      <Link href="/" theme={null}>
        text
      </Link>,
    );
    const { textDecoration } = getComputedStyle(getByRole('link'));
    expect(textDecoration).toBe('none');
  });
});

describe('when button-styled', () => {
  it('adds button styles', () => {
    const { getByRole, rerender } = render(<Link href="/">text</Link>);
    expect(getComputedStyle(getByRole('link')).paddingLeft).toBe('');

    rerender(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );
    expect(
      Number(
        getComputedStyle(getByRole('link')).paddingLeft.replace(/em$/, ''),
      ),
    ).toBeGreaterThan(0);
  });

  it('supports primary button styles', () => {
    const { getByRole, rerender } = render(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );
    expect(getComputedStyle(getByRole('link')).backgroundColor).not.toBe(
      fern.rgb,
    );

    rerender(
      <Link href="/" buttonStyle primary>
        text
      </Link>,
    );
    expect(getComputedStyle(getByRole('link')).backgroundColor).toBe(fern.rgb);
  });

  it('supports small button styles', () => {
    const { getByRole, rerender } = render(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );
    const normalHeight = Number(
      getComputedStyle(getByRole('link')).height.replace(/em$/, ''),
    );

    rerender(
      <Link href="/" buttonStyle small>
        text
      </Link>,
    );
    const smallHeight = Number(
      getComputedStyle(getByRole('link')).height.replace(/em$/, ''),
    );

    expect(smallHeight).toBeLessThan(normalHeight);
  });
});

describe.each`
  contextDescription    | wrapper
  ${'with a router'}    | ${StaticRouter}
  ${'without a router'} | ${undefined}
`('$contextDescription', ({ wrapper }) => {
  describe.each`
    linkDescription    | href
    ${'external link'} | ${'https://parkinsonsroadmap.org/'}
    ${'internal link'} | ${'/'}
    ${'internal link'} | ${''}
  `("for an $linkDescription to '$href'", ({ href }) => {
    it('applies the href to the anchor', () => {
      const { getByRole } = render(<Link href={href}>text</Link>, {
        wrapper,
      });
      const anchor = getByRole('link') as HTMLAnchorElement;
      expect(new URL(anchor.href, window.location.href).href).toBe(
        new URL(href, window.location.href).href,
      );
    });
  });

  it('renders an inactive link without an href', () => {
    const { getByText } = render(<Link href={undefined}>text</Link>, {
      wrapper,
    });
    expect(getByText('text', { selector: 'a' })).not.toHaveAttribute('href');
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
