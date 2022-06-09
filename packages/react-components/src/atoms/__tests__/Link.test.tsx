import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Link from '../Link';
import { fern, paper, silver } from '../../colors';

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

  it('renders button with correct margins', () => {
    const { getByRole, rerender } = render(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );

    const buttonWithoutMargin = Number(
      getComputedStyle(getByRole('link')).marginTop.replace(/em$/, ''),
    );

    expect(buttonWithoutMargin).toBe(1.0588235294117647);

    rerender(
      <Link href="/" buttonStyle margin={false}>
        text
      </Link>,
    );

    const buttonWithMargin = Number(
      getComputedStyle(getByRole('link')).margin.replace(/em$/, ''),
    );

    expect(buttonWithMargin).toBe(0);
  });

  it('renders button with default margin', () => {
    const { getByRole } = render(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );

    const buttonWithoutMargin = Number(
      getComputedStyle(getByRole('link')).margin.replace(/em$/, ''),
    );

    expect(buttonWithoutMargin).toBe(0);
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
    const normalPaddingTop = Number(
      getComputedStyle(getByRole('link')).paddingTop.replace(/em$/, ''),
    );

    rerender(
      <Link href="/" buttonStyle small>
        text
      </Link>,
    );
    const smallPaddingTop = Number(
      getComputedStyle(getByRole('link')).paddingTop.replace(/em$/, ''),
    );

    expect(smallPaddingTop).toBeLessThan(normalPaddingTop);
  });

  it('supports disabled button styles', () => {
    const { getByText, rerender } = render(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );
    expect(
      findParentWithStyle(getByText('text'), 'backgroundColor')!
        .backgroundColor,
    ).not.toBe(silver.rgb);

    rerender(
      <Link href="/" buttonStyle enabled={false}>
        text
      </Link>,
    );
    expect(
      findParentWithStyle(getByText('text'), 'backgroundColor')!
        .backgroundColor,
    ).toBe(silver.rgb);
  });

  it('removes the href when disabled', () => {
    const { getByText, rerender } = render(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );
    expect(getByText('text').closest('a')).toHaveAttribute('href');
    rerender(
      <Link href="/" buttonStyle enabled={false}>
        text
      </Link>,
    );
    expect(getByText('text').closest('a')).not.toHaveAttribute('href');
  });
});
