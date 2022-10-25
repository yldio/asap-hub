import { pixels } from '@asap-hub/react-components';

const { largeDesktopScreen, smallDesktopScreen, tabletScreen } = pixels;

export const smallDesktopQuery = `@media (min-width: ${
  smallDesktopScreen.width
}px) and (max-width: ${largeDesktopScreen.width - 1}px)`;

export const mobileQuery = `@media (max-width: ${tabletScreen.width - 1}px)`;
