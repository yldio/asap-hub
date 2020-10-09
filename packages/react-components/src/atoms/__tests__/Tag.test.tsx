import React from 'react';
import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Tag from '../Tag';
import { mint } from '../../colors';

it('renders a tag with content', () => {
  const { container } = render(<Tag>Text</Tag>);
  expect(container.textContent).toEqual('Text');
});

it('renders a tag with background color when highlighted', () => {
  const { getByText, rerender } = render(<Tag>Text</Tag>);
  expect(findParentWithStyle(getByText('Text'), 'backgroundColor')).toBeNull();

  rerender(<Tag highlight>Text</Tag>);
  expect(
    findParentWithStyle(getByText('Text'), 'backgroundColor')?.backgroundColor,
  ).toBe(mint.rgb);
});
