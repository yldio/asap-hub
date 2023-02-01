import 'jest-playwright-preset';

import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import domToPlaywright from 'dom-to-playwright';

import Layout from '../Layout';
import { largeDesktopScreen } from '../../pixels';

const props: ComponentProps<typeof Layout> = {
  children: 'Content',
  userOnboarded: true,
  userProfileHref: '/profile',
  teams: [],
  aboutHref: '/about',
};

afterEach(async () => {
  await jestPlaywright.resetPage();
});

describe('on desktop', () => {
  beforeEach(() => {
    page.setViewportSize(largeDesktopScreen);
  });

  it('does not show the user navigation initially', async () => {
    const { findAllByText } = render(<Layout {...props} />);
    const userMenu = (
      await findAllByText(/profile/i, {
        selector: 'nav *',
      })
    )[0].closest('nav')!;
    const { select } = await domToPlaywright(page, document);

    const scrollHeight = await page.$eval(
      select(userMenu),
      (elem: Element) => elem.scrollHeight,
    );
    expect(scrollHeight).toBe(0);
  });
  it('shows the user navigation after clicking the menu button', async () => {
    const { findAllByText, getByLabelText } = render(<Layout {...props} />);
    userEvent.click(getByLabelText(/toggle.+user menu/i));
    const userMenu = (
      await findAllByText(/profile/i, {
        selector: 'nav *',
      })
    )[0].closest('nav')!;
    const { select } = await domToPlaywright(page, document);

    const scrollHeight = await page.$eval(
      select(userMenu),
      (elem: Element) => elem.scrollHeight,
    );
    expect(scrollHeight).toBeGreaterThan(0);
  });

  it('always shows the main navigation', async () => {
    const { findAllByText } = render(<Layout {...props} />);
    const mainMenu = (
      await findAllByText(/network/i, {
        selector: 'nav *',
      })
    )[0].closest('nav')!;
    const { select } = await domToPlaywright(page, document);

    const scrollHeight = await page.$eval(
      select(mainMenu),
      (elem: Element) => elem.scrollHeight,
    );
    expect(scrollHeight).toBeGreaterThan(0);
  });
});
