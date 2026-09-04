import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React, { ComponentProps } from 'react';
import ExpandableText from '../ExpandableText';

describe('ExpandableText', () => {
  const text = 'this is a text';
  it('renders the children', () => {
    render(<ExpandableText>{text}</ExpandableText>);
    expect(screen.getByText(text)).toBeVisible();
  });
  it('renders show more if text height is larger than max height', async () => {
    const ref = { current: { scrollHeight: 125 } };

    Object.defineProperty(ref, 'current', {
      set(_current) {
        this.mockedCurrent = _current;
      },
      get() {
        return { scrollHeight: 125 };
      },
    });
    jest.spyOn(React, 'useRef').mockReturnValue(ref);

    render(<ExpandableText>{text}</ExpandableText>);
    const button = screen.getByRole('button');
    expect(button).toBeVisible();
    expect(button.textContent).toMatchInlineSnapshot(`"Show moreChevron Down"`);
    await userEvent.click(button);
    expect(button.textContent).toMatchInlineSnapshot(`"Show lessChevron Down"`);
  });

  it('renders show more with arrow variant', async () => {
    const ref = { current: { scrollHeight: 125 } };

    Object.defineProperty(ref, 'current', {
      set(_current) {
        this.mockedCurrent = _current;
      },
      get() {
        return { scrollHeight: 125 };
      },
    });
    jest.spyOn(React, 'useRef').mockReturnValue(ref);

    render(<ExpandableText variant="arrow">{text}</ExpandableText>);
    const button = screen.getByRole('button');
    expect(button).toBeVisible();
    expect(button.textContent).toMatchInlineSnapshot(`"Show more ↓"`);
    await userEvent.click(button);
    expect(button.textContent).toMatchInlineSnapshot(`"Show less ↑"`);
  });

  describe('expandOnce', () => {
    const renderExpanded = async (
      overrideProps?: ComponentProps<typeof ExpandableText>,
    ) => {
      const ref = { current: { scrollHeight: 125 } };

      Object.defineProperty(ref, 'current', {
        set(_current) {
          this.mockedCurrent = _current;
        },
        get() {
          return { scrollHeight: 125 };
        },
      });
      jest.spyOn(React, 'useRef').mockReturnValue(ref);

      render(<ExpandableText {...overrideProps}>{text}</ExpandableText>);
      const button = screen.getByRole('button');
      expect(button).toBeVisible();
      expect(button.textContent).toMatchInlineSnapshot(
        `"Show moreChevron Down"`,
      );
      await userEvent.click(button);
    };
    it('renders show less when expanded if expandOnce is not passed', async () => {
      await renderExpanded();
      expect(screen.queryByText(/less/i)).toBeInTheDocument();
    });

    it('renders show less when expanded if expandOnce is false', async () => {
      await renderExpanded({ expandOnce: false });
      expect(screen.queryByText(/less/i)).toBeInTheDocument();
    });

    it('does not render show less when expanded if expandOnce is true', async () => {
      await renderExpanded({ expandOnce: true });
      expect(screen.queryByText(/less/i)).not.toBeInTheDocument();
    });
  });
});
