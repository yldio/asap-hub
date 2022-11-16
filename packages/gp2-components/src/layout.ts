import { drawerQuery, pixels } from '@asap-hub/react-components';

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

export const mobileQuery = `@media (max-width: ${tabletScreen.width - 1}px)`;
export const nonMobileQuery = `@media (min-width: ${tabletScreen.width}px)`;

export const layoutContentStyles = {
  width: '748px',
  padding: `${vminLinearCalcClamped(
    mobileScreen,
    33,
    tabletScreen,
    48,
    'px',
  )} 0`,
  margin: `0 auto`,
  [drawerQuery]: {
    maxWidth: '748px',
    width: 'auto',
    margin: `0 ${vminLinearCalcClamped(
      mobileScreen,
      24,
      tabletScreen,
      72,
      'px',
    )}`,
  },
};
