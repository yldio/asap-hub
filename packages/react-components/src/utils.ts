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

export const isLink = (link: string = ''): boolean => {
  try {
    return Boolean(new URL(link));
  } catch (_) {
    return false;
  }
};

export const isInternalLink = (href: string): [boolean, string] => {
  if (globalThis.location) {
    const url = new URL(href, globalThis.location.href);
    if (url.origin === globalThis.location.origin) {
      return [true, `${url.pathname}${url.search}${url.hash}`];
    }
    return [false, url.toString()];
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

export const capitalizeStr = (str: string = '') =>
  str
    .toLocaleLowerCase()
    .split(' ')
    .map((word) => {
      const [firstLetter, ...rest] = word;
      return `${firstLetter.toUpperCase()}${rest.join('')}`;
    })
    .join(' ');

export const getListStrWithSuffix = (
  arr: string[] = [],
  suffix: string = '',
): string =>
  Array.from(new Set(arr))
    .reduce((acc: string[], item, currentIdx, arr) => {
      const lastIdx = arr.length - 1;
      const text = capitalizeStr(`${item} ${suffix}`);

      arr.length === 1 || currentIdx !== lastIdx
        ? acc.push(`${text}`)
        : acc.push(`and ${text}`);

      return acc;
    }, [])
    .join(',');
