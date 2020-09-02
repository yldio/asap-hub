import React from 'react';
import { render } from '@testing-library/react';

import Avatar from '../Avatar';
import { findParentWithStyle, viewportCalc } from '../../test-utils';

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

it.each`
  firstName    | lastName     | initials
  ${'John'}    | ${'Doe'}     | ${'JD'}
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

it('respects the small prop', () => {
  const { getByText, rerender } = render(<Avatar firstName="J" lastName="D" />);
  const normalFontSize = Number(
    viewportCalc(
      findParentWithStyle(getByText(/[A-Z]/), 'fontSize')!.fontSize,
    ).replace(/px$/, ''),
  );

  rerender(<Avatar firstName="J" lastName="D" small />);
  const smallFontSize = Number(
    getComputedStyle(getByText(/[A-Z]/)).fontSize.replace(/em$/, ''),
  );

  expect(smallFontSize).toBeLessThan(normalFontSize);
});
