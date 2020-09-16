import {
  screen,
  vminLinearCalc,
  Screen,
  vminLinearCalcClamped,
} from '../pixels';

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

describe('vminLinearCalcClamped', () => {
  it('creates a vminLinearCalc clamped to the value range', () => {
    const smallScreen: Screen = { width: 125, height: 100, min: 100, max: 125 };
    const largeScreen: Screen = { width: 250, height: 200, min: 200, max: 250 };
    expect(
      vminLinearCalcClamped(smallScreen, 10, largeScreen, 12, 'px'),
    ).toEqual('clamp(10px, calc(8px + 2vmin), 12px)');
  });
});
