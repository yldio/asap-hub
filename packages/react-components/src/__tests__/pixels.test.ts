import {
  screen,
  vminLinearCalc,
  Screen,
  contentSidePaddingWithNavigation,
  contentSidePaddingWithoutNavigation,
  largeDesktopScreen,
} from '../pixels';
import { viewportCalc } from '../test-utils';

describe('screen', () => {
  it('sets the dimensions', () => {
    expect(screen(1920, 1080)).toStrictEqual({
      width: 1920,
      height: 1080,
      min: 1080,
      max: 1920,
    });
  });
});

describe('vminLinearCalc', () => {
  it('creates a CSS calc for a linear scale based on vmin size', () => {
    const smallScreen: Screen = { width: 125, height: 100, min: 100, max: 125 };
    const largeScreen: Screen = { width: 250, height: 200, min: 200, max: 250 };
    expect(vminLinearCalc(smallScreen, 10, largeScreen, 12, 'px')).toEqual(
      'calc(8px + 2vmin)',
    );
  });
});

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
