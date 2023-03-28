import {
  smallDesktopScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from './pixels';
import { color } from './colors';

export const navigationGrey = color(242, 245, 247);

export const drawerQuery = `@media (max-width: ${
  smallDesktopScreen.width - 1
}px)`;
export const crossQuery = `@media (min-width: ${smallDesktopScreen.width}px)`;

const largeDesktopColWidth = 66;
const largeDesktopColGap = 30;
export const contentSidePaddingWithoutNavigation = (
  desktopCols: 2 | 4 | 6 | 8 | 10 | 12 = 12,
): string =>
  vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    159 +
      ((12 - desktopCols) / 2) * (largeDesktopColWidth + largeDesktopColGap),
    'px',
  );
export const contentSidePaddingWithNavigation = (
  desktopCols: 2 | 4 | 6 | 8 | 10 | 12 = 12,
): string =>
  vminLinearCalc(
    mobileScreen,
    24,
    largeDesktopScreen,
    30 + ((12 - desktopCols) / 2) * (largeDesktopColWidth + largeDesktopColGap),
    'px',
  );
