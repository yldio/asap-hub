import React from 'react';
import { render } from '@testing-library/react';

import Tag from '../Tag';
import { mint } from '../../colors';

it('renders a tag with content', () => {
  const { container } = render(<Tag>Text</Tag>);
  expect(container.textContent).toEqual('Text');
});

it('renders a tag with background color when highlighted', () => {
  const { container } = render(<Tag highlight />);
  expect(
    getComputedStyle(container.firstElementChild!.firstElementChild!)
      .backgroundColor,
  ).toBe(mint.rgb);
});
