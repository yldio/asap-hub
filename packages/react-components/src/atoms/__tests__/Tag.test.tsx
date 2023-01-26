import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';
import userEvent from '@testing-library/user-event';
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
  expect(findParentWithStyle(getByText('Text'), 'color')?.color).not.toBe(
    tin.rgb,
  );
  expect(
    findParentWithStyle(getByText('Text'), 'borderColor')?.borderColor,
  ).not.toEqual(tin.rgb);

  rerender(<Tag enabled={false}>Text</Tag>);

  expect(findParentWithStyle(getByText('Text'), 'color')?.color).toBe(tin.rgb);
  expect(
    findParentWithStyle(getByText('Text'), 'borderColor')?.borderColor,
  ).toEqual(tin.rgb);
});

it('renders a tag with a title', () => {
  const { getByTitle } = render(<Tag title="Text"></Tag>);
  expect(getByTitle('Text')).toBeVisible();
});

it('renders the remove Button if the onRemove is provided', () => {
  const onRemove = jest.fn();
  const { getByRole } = render(<Tag title="Text" onRemove={onRemove}></Tag>);
  const onRemoveButton = getByRole('button');
  expect(onRemoveButton).toBeVisible();
  userEvent.click(onRemoveButton);
  expect(onRemove).toBeCalled();
});
