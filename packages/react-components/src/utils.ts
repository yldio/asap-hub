import { renderToStaticMarkup } from 'react-dom/server';
import {
  googleDriveIcon,
  protocolsIcon,
  slackIcon,
  googleCalendarIcon,
} from './icons';

/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = (): void => {};

export const getSvgAspectRatio = (element: React.ReactElement): number => {
  const markup = renderToStaticMarkup(element);

  const container = document.createElement('div');
  container.innerHTML = markup;

  const svg = container.querySelector('svg');
  if (!svg) {
    throw new Error(
      'Failed to calculate SVG aspect ratio. Element does not contain an SVG.',
    );
  }
  const { width, height } = svg.viewBox.baseVal;
  return width / height;
};

export const isInternalLink = (href: string): boolean =>
  globalThis.location &&
  new URL(href, globalThis.location.href).origin === globalThis.location.origin;

const icons = Object.entries({
  '.slack.com': slackIcon,
  'protocols.io': protocolsIcon,
  'drive.google.com': googleDriveIcon,
  'calendar.google.com': googleCalendarIcon,
});

export const getIconFromUrl = (url: string): JSX.Element | undefined => {
  const icon = icons.find(([key]) => {
    try {
      const { host } = new URL(url);
      return host.endsWith(key);
    } catch {
      return false;
    }
  });
  return icon?.[1];
};
