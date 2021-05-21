import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Tag from '../Tag';
import { mint, tin } from '../../colors';

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

it('renders a tag with different border and text color when disabled', () => {
  const { getByText, rerender } = render(<Tag>Text</Tag>);
  expect(getComputedStyle(getByText('Text')).color).not.toBe(tin.rgb);
  expect(getComputedStyle(getByText('Text')).borderColor).not.toEqual(tin.rgb);

  rerender(<Tag enabled={false}>Text</Tag>);
  expect(getComputedStyle(getByText('Text')).color).toBe(tin.rgb);
  expect(getComputedStyle(getByText('Text')).borderColor).toEqual(tin.rgb);
});
