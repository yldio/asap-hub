import { render } from '@testing-library/react';
import domToPlaywright from 'dom-to-playwright';
import { createListUserResponse } from '@asap-hub/fixtures';
import 'jest-playwright-preset';

import MembersList from '../MembersList';
import { largeDesktopScreen } from '../../pixels';
import { getBoundingClientRect } from '../../browser-test-utils';

const [firstUser, secondUser] = createListUserResponse(2).items.map((user) => ({
  ...user,
  firstLine: user.displayName,
  secondLine: user.role,
  thirdLine: 'Team',
  href: '#0',
}));

it('respects the singleColumn prop', async () => {
  page.setViewportSize(largeDesktopScreen);
  const { rerender, getByText } = render(
    <MembersList members={[firstUser, secondUser]} />,
  );
  const { select, update } = await domToPlaywright(page, document);

  let first = await getBoundingClientRect(
    select(getByText(firstUser.displayName)),
  );
  let second = await getBoundingClientRect(
    select(getByText(secondUser.displayName)),
  );
  expect(second.y).toEqual(first.y);
  expect(second.x).toBeGreaterThan(first.x);

  rerender(<MembersList singleColumn members={[firstUser, secondUser]} />);
  update(document);

  first = await getBoundingClientRect(select(getByText(firstUser.displayName)));
  second = await getBoundingClientRect(
    select(getByText(secondUser.displayName)),
  );
  expect(second.x).toEqual(first.x);
  expect(second.y).toBeGreaterThan(first.y);
});
