import { render } from '@testing-library/react';
import domToPlaywright from 'dom-to-playwright';
import 'jest-playwright-preset';

import TagList from '../TagList';
import { mobileScreen, largeDesktopScreen } from '../../pixels';

afterEach(async () => {
  await jestPlaywright.resetPage();
});

describe('on mobile', () => {
  beforeEach(async () => {
    await page.setViewportSize(mobileScreen);
  });

  it('shows at most *min* tags when set', async () => {
    const { getByRole } = render(<TagList min={1} tags={['A', 'B']} />);
    const { select } = await domToPlaywright(page, document);

    const listText = await page.$eval(
      select(getByRole('list')),
      ({ innerText }: HTMLElement) => innerText,
    );
    expect(listText).toContain('A');
    expect(listText).not.toContain('B');
  });

  it('shows at most *max* tags when *min* not set', async () => {
    const { getByRole } = render(<TagList max={1} tags={['A', 'B']} />);
    const { select } = await domToPlaywright(page, document);

    const listText = await page.$eval(
      select(getByRole('list')),
      ({ innerText }: HTMLElement) => innerText,
    );
    expect(listText).toContain('A');
    expect(listText).not.toContain('B');
  });
});

describe('on desktop', () => {
  beforeEach(async () => {
    await page.setViewportSize(largeDesktopScreen);
  });

  it('shows at most *max* tags when set', async () => {
    const { getByRole } = render(<TagList max={1} tags={['A', 'B']} />);
    const { select } = await domToPlaywright(page, document);

    const listText = await page.$eval(
      select(getByRole('list')),
      ({ innerText }: HTMLElement) => innerText,
    );
    expect(listText).toContain('A');
    expect(listText).not.toContain('B');
  });

  it('shows all text when *max* not set', async () => {
    const { getByRole } = render(<TagList min={1} tags={['A', 'B']} />);
    const { select } = await domToPlaywright(page, document);

    const listText = await page.$eval(
      select(getByRole('list')),
      ({ innerText }: HTMLElement) => innerText,
    );
    expect(listText).toContain('A');
    expect(listText).toContain('B');
  });
});
