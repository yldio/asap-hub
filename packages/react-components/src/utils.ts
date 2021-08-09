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

export const getListStrWithSuffix = (
  data: (string | null | undefined)[] = [],
  suffix: string = '',
  format?: (str: string) => string,
): string =>
  Array.from(new Set(data))
    .filter((value): value is string => !!value?.trim())
    .map((item, idx, arr) => {
      const itemFormatted = format ? format(item) : item;
      const itemValue = suffix ? `${itemFormatted} ${suffix}` : itemFormatted;
      const lastIdx = arr.length - 1;
      return arr.length === 1 || idx !== lastIdx
        ? `${itemValue}`
        : `and ${itemValue}`;
    })
    .join(', ');

export const capitalizeText = (str: string = ''): string =>
  str
    .split(' ')
    .reduce((acc: string[], w) => {
      if (w) {
        const [firstLetter, ...rest] = w.toLocaleLowerCase();
        acc.push(`${firstLetter.toUpperCase()}${rest.join('')}`);
      }
      return acc;
    }, [])
    .join(' ');
