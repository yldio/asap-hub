import { render } from '@testing-library/react';
import domToPlayWright from 'dom-to-playwright';

import ProfileCardList from '../ProfileCardList';
import { getBoundingClientRect } from '../../browser-test-utils';
import { mobileScreen, largeDesktopScreen } from '../../pixels';

afterEach(async () => {
  await jestPlaywright.resetPage();
});

describe('on mobile', () => {
  beforeEach(() => {
    page.setViewportSize(mobileScreen);
  });

  it.only('renders edit buttons above their cards', async () => {
    const { getByText, getByLabelText } = render(
      <ProfileCardList>
        {[
          { card: 'card1', editLink: { href: '/edit1', label: 'Edit card 1' } },
        ]}
      </ProfileCardList>,
    );
    const { select } = await domToPlayWright(page, document);

    const { top: cardTop, right: cardRight } = await getBoundingClientRect(
      select(getByText('card1')),
    );
    const { bottom: editBottom, right: editRight } =
      await getBoundingClientRect(select(getByLabelText('Edit card 1')));

    expect(editRight).toBeCloseTo(cardRight, -2);
    expect(editBottom).toBeLessThan(cardTop);
  });
});

describe('on desktop', () => {
  beforeEach(() => {
    page.setViewportSize(largeDesktopScreen);
  });

  it('renders edit buttons next to their cards', async () => {
    const { getByText, getByLabelText } = render(
      <ProfileCardList>
        {[
          { card: 'card1', editLink: { href: '/edit1', label: 'Edit card 1' } },
        ]}
      </ProfileCardList>,
    );
    const { select } = await domToPlayWright(page, document);

    const { right: cardRight, top: cardTop } = await getBoundingClientRect(
      select(getByText('card1')),
    );
    const { left: editLeft, top: editTop } = await getBoundingClientRect(
      select(getByLabelText('Edit card 1')),
    );

    expect(editTop).toBeCloseTo(cardTop, -2);
    expect(editLeft).toBeGreaterThan(cardRight);
  });
});
