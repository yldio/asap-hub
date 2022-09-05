import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import ExpandableText from '../ExpandableText';

describe('ExpandableText', () => {
  const text = 'this is a text';
  it('renders the children', () => {
    render(<ExpandableText>{text}</ExpandableText>);
    expect(screen.getByText(text)).toBeVisible();
  });
  it('renders show more if text height is larger than max height', () => {
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
    userEvent.click(button);
    expect(button.textContent).toMatchInlineSnapshot(`"Show lessChevron Down"`);
  });
});
