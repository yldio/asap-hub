import { pixels } from '@asap-hub/react-components';

const {
  largeDesktopScreen,
  smallDesktopScreen,
  tabletScreen,
  vminLinearCalcClamped,
  mobileScreen,
} = pixels;

export const smallDesktopQuery = `@media (min-width: ${
  smallDesktopScreen.width
}px) and (max-width: ${largeDesktopScreen.width - 1}px)`;

const headerMaxWidth = 748;
const smallerScreenMaxMargin = 72;

export const mobileQuery = `@media (max-width: ${tabletScreen.width - 1}px)`;
export const nonMobileQuery = `@media (min-width: ${tabletScreen.width}px)`;
export const smallerScreenQuery = `@media (max-width: ${
  headerMaxWidth + smallerScreenMaxMargin * 2 - 1
}px)`;

export const layoutContentStyles = {
  width: headerMaxWidth,
  padding: `${vminLinearCalcClamped(
    mobileScreen,
    33,
    tabletScreen,
    48,
    'px',
  )} 0`,
  margin: `0 auto`,
  [smallerScreenQuery]: {
    maxWidth: headerMaxWidth,
    width: 'auto',
    margin: `0 ${vminLinearCalcClamped(
      mobileScreen,
      24,
      tabletScreen,
      smallerScreenMaxMargin,
      'px',
    )}`,
  },
};
