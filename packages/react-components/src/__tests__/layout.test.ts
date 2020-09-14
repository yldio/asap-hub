import {
  contentSidePaddingWithoutNavigation,
  contentSidePaddingWithNavigation,
} from '../layout';
import { viewportCalc } from '../test-utils';
import { largeDesktopScreen } from '../pixels';

describe('contentSidePaddingWithoutNavigation', () => {
  it('without arguments returns the minimum side padding', () => {
    expect(
      viewportCalc(contentSidePaddingWithoutNavigation(), largeDesktopScreen),
    ).toMatchInlineSnapshot(`"159px"`);
  });

  it('increases the padding to account for fewer columns', () => {
    const normalSidePadding = Number(
      viewportCalc(
        contentSidePaddingWithoutNavigation(),
        largeDesktopScreen,
      ).replace(/px$/, ''),
    );
    const twoColumnSidePadding = Number(
      viewportCalc(
        contentSidePaddingWithoutNavigation(2),
        largeDesktopScreen,
      ).replace(/px$/, ''),
    );
    expect(twoColumnSidePadding).toBeGreaterThan(normalSidePadding);
  });
});

describe('contentSidePaddingWithNavigation', () => {
  it('without arguments returns the minimum side padding', () => {
    expect(
      viewportCalc(contentSidePaddingWithNavigation(), largeDesktopScreen),
    ).toMatchInlineSnapshot(`"30px"`);
  });

  it('increases the padding to account for fewer columns', () => {
    const normalSidePadding = Number(
      viewportCalc(
        contentSidePaddingWithNavigation(),
        largeDesktopScreen,
      ).replace(/px$/, ''),
    );
    const twoColumnSidePadding = Number(
      viewportCalc(
        contentSidePaddingWithNavigation(2),
        largeDesktopScreen,
      ).replace(/px$/, ''),
    );
    expect(twoColumnSidePadding).toBeGreaterThan(normalSidePadding);
  });
});
