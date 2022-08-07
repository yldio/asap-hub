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

  it('applies an invisible underline', () => {
    const { getByRole } = render(<Link href="/">text</Link>);
    const { textDecoration } = getComputedStyle(getByRole('link'));
    expect(textDecoration).toBe('underline solid transparent');
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

  it('applies an invisible underline', () => {
    const { getByRole } = render(
      <Link href="/" theme="dark">
        text
      </Link>,
    );
    const { textDecoration } = getComputedStyle(getByRole('link'));
    expect(textDecoration).toBe('underline solid transparent');
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

    const buttonWithMargin = Number(
      getComputedStyle(getByRole('link')).marginTop.replace(/em$/, ''),
    );

    expect(buttonWithMargin).toBe(1.0588235294117647);

    rerender(
      <Link href="/" buttonStyle margin={false}>
        text
      </Link>,
    );

    const buttonWithoutMargin = Number(
      getComputedStyle(getByRole('link')).margin.replace(/em$/, ''),
    );

    expect(buttonWithoutMargin).toBe(0);
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

  it('renders button streched by default', () => {
    const { getByRole } = render(
      <Link href="/" buttonStyle>
        text
      </Link>,
    );

    expect(getComputedStyle(getByRole('link')).flexGrow).toBe('1');
  });

  it('renders a non-streched button', () => {
    const { getByRole } = render(
      <Link href="/" buttonStyle stretch={false}>
        text
      </Link>,
    );

    expect(getComputedStyle(getByRole('link')).flexGrow).toBe('');
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

describe('for elipsed links', () => {
  describe('when child is a string', () => {
    it('shows the title with the full text', () => {
      const longText =
        'A very long text showing that the elipsis feature is working well, trying to provide as much text here as I can to validate this feature.';
      const { getByTitle } = render(
        <div css={{ maxWidth: '10px' }}>
          <Link href="/" ellipsed>
            {longText}
          </Link>
        </div>,
      );

      expect(getByTitle(longText)).toBeInTheDocument();
    });
  });

  describe('when child is not a string', () => {
    it('does not show the title for buttonStyles', () => {
      const longText =
        'A very long text showing that the elipsis feature is working well, trying to provide as much text here as I can to validate this feature.';
      const { queryByTitle } = render(
        <div css={{ maxWidth: '10px' }}>
          <Link href="/" ellipsed buttonStyle>
            {longText}
          </Link>
        </div>,
      );

      expect(queryByTitle(longText)).not.toBeInTheDocument();
    });

    it('does not show the title for divs or any inner components', () => {
      const longText =
        'A very long text showing that the elipsis feature is working well, trying to provide as much text here as I can to validate this feature.';
      const { getByTestId } = render(
        <div css={{ maxWidth: '10px' }}>
          <Link href="/" ellipsed>
            <div data-testid="inner-div">{longText}</div>
          </Link>
        </div>,
      );

      expect(getByTestId('inner-div').closest('a')).not.toHaveAttribute(
        'title',
      );
    });
  });
});
