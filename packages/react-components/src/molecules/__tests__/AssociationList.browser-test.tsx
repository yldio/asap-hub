import { render } from '@testing-library/react';
import domToPlaywright from 'dom-to-playwright';
import 'jest-playwright-preset';

import AssociationList from '../AssociationList';
import { largeDesktopScreen } from '../../pixels';
import { getBoundingClientRect } from '../../browser-test-utils';

beforeEach(async () => {
  await page.setViewportSize(largeDesktopScreen);
});
afterEach(async () => {
  await jestPlaywright.resetPage();
});

it('supports the block and inline modes', async () => {
  const { getByText, rerender } = render(
    <AssociationList
      inline={false}
      type="Team"
      associations={[
        { displayName: 'One', id: 't0' },
        { displayName: 'Two', id: 't1' },
      ]}
    />,
  );
  const { select, update } = await domToPlaywright(page, document);

  const { x: blockX1, y: blockY1 } = await getBoundingClientRect(
    select(getByText(/One/)),
  );
  const { x: blockX2, y: blockY2 } = await getBoundingClientRect(
    select(getByText(/Two/)),
  );
  expect(blockX2).toEqual(blockX1);
  expect(blockY2).toBeGreaterThan(blockY1);

  rerender(
    <AssociationList
      inline
      type="Team"
      associations={[
        { displayName: 'One', id: 't0' },
        { displayName: 'Two', id: 't1' },
      ]}
    />,
  );
  await update(document);

  const { x: inlineX1, y: inlineY1 } = await getBoundingClientRect(
    select(getByText(/One/)),
  );
  const { x: inlineX2, y: inlineY2 } = await getBoundingClientRect(
    select(getByText(/Two/)),
  );
  expect(inlineX2).toBeGreaterThan(inlineX1);
  expect(inlineY2).toEqual(inlineY1);
});
