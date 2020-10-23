import React from 'react';
import { render } from '@testing-library/react';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import Avatar from '../Avatar';
import { paper } from '../../colors';

it('renders the profile picture', () => {
  const { getByRole } = render(<Avatar imageUrl="/avatar.png" />);
  expect(getByRole('img')).toHaveAttribute('src', '/avatar.png');
});

it('generates an alt text based on the name', () => {
  const { getByAltText } = render(
    <Avatar imageUrl="/avatar.png" firstName="John" lastName="Doe" />,
  );
  expect(getByAltText(/pic.+John Doe/i)).toBeVisible();
});

it('generates an alt text when no name is available', () => {
  const { getByRole } = render(<Avatar imageUrl="/avatar.png" />);
  expect((getByRole('img') as HTMLImageElement).alt).toMatchInlineSnapshot(
    `"Profile picture"`,
  );
});

it('shows a placeholder on white background', () => {
  const { getByText } = render(<Avatar placeholder="+1" />);

  expect(getByText('+1')).toBeVisible();

  const { backgroundColor } = findParentWithStyle(
    getByText('+1'),
    'backgroundColor',
  )!;
  expect(backgroundColor).toBe(paper.rgb);
});

it("shows the initials 'JD' on colored background", () => {
  const { getByText } = render(<Avatar firstName="John" lastName="Doe" />);

  expect(getByText('JD')).toBeVisible();

  const { backgroundColor } = findParentWithStyle(
    getByText('JD'),
    'backgroundColor',
  )!;
  expect(backgroundColor).not.toBe(paper.rgb);
});

it.each`
  firstName    | lastName     | initials
  ${'John'}    | ${undefined} | ${'J'}
  ${undefined} | ${'Doe'}     | ${'D'}
  ${undefined} | ${undefined} | ${''}
`(
  "shows the initials '$initials' when no image is available",
  ({ initials, ...nameProps }) => {
    const { container } = render(<Avatar {...nameProps} />);
    expect(container).toHaveTextContent(initials);
  },
);

it('respects the border prop', () => {
  const { getByRole, rerender } = render(<Avatar imageUrl="/avatar.png" />);
  expect(
    findParentWithStyle(getByRole('img'), 'borderStyle')?.borderStyle,
  ).toBeFalsy();

  rerender(<Avatar imageUrl="/avatar.png" border />);
  expect(
    findParentWithStyle(getByRole('img'), 'borderStyle')?.borderStyle,
  ).toMatchInlineSnapshot(`"solid"`);
});
