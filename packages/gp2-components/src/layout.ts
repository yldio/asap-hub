import { pixels } from '@asap-hub/react-components';

const { largeDesktopScreen, smallDesktopScreen } = pixels;

export const smallDesktopQuery = `@media (min-width: ${
  smallDesktopScreen.width
}px) and (max-width: ${largeDesktopScreen.width - 1}px)`;
