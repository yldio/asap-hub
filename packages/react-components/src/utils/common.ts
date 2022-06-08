import { renderToStaticMarkup } from 'react-dom/server';

import {
  googleDriveIcon,
  protocolsIcon,
  slackIcon,
  googleCalendarIcon,
} from '../icons';

/* istanbul ignore next */
// eslint-disable-next-line @typescript-eslint/no-empty-function
export const noop = () => {};

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

export const isLink = (link: string = ''): boolean => {
  try {
    return Boolean(new URL(link));
  } catch (_) {
    return false;
  }
};

export const isInternalLink = (href: string): [boolean, string] => {
  if (globalThis.location) {
    try {
      const url = new URL(href, globalThis.location.href);
      if (url.origin === globalThis.location.origin) {
        return [true, `${url.pathname}${url.search}${url.hash}`];
      }

      return [false, url.toString()];
    } catch {
      return [false, ''];
    }
  }
  return [false, href];
};

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

export function equals(a: Array<string>, b: Array<string>): boolean {
  return (
    a.length === b.length && a.every((element, index) => element === b[index])
  );
}
