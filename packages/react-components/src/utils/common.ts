import { renderToStaticMarkup } from 'react-dom/server';

import {
  googleDriveIcon,
  protocolsIcon,
  slackIcon,
  googleCalendarIcon,
} from '../icons';
import { TabProps } from '../molecules/TabbedCard';

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

export function splitListBy<T>(
  properties: string[],
  list: ReadonlyArray<T>,
): ReadonlyArray<T>[] {
  const firstPart = list.filter(
    (item: T) =>
      !!properties.reduce((i: T, p, idx) => i[p as keyof T] as T, item),
  );
  const secondPart = list.filter(
    (item: T) => !properties.reduce((i, p) => i[p as keyof T] as T, item),
  );

  return [firstPart, secondPart];
}

export function buildTabsConfig<T>({
  disableActiveTab,
  items,
  label,
  lookupProps,
  truncateFrom,
}: {
  disableActiveTab: boolean;
  items: ReadonlyArray<T>;
  label: string;
  lookupProps: string[];
  truncateFrom?: number;
}): TabProps<T>[] {
  if (disableActiveTab) {
    return [
      {
        tabTitle: `Active ${label} (0)`,
        items: [],
        disabled: true,
        truncateFrom,
      },
      {
        tabTitle: `Past ${label} (${items.length})`,
        items,
        disabled: items.length === 0,
        truncateFrom,
      },
    ];
  }

  const [inactive, active] = splitListBy(lookupProps, items);

  return [
    {
      tabTitle: `Active ${label} (${active.length})`,
      items: active,
      disabled: active.length === 0,
      truncateFrom,
    },
    {
      tabTitle: `Past ${label} (${inactive.length})`,
      items: inactive,
      disabled: inactive.length === 0,
      truncateFrom,
    },
  ];
}
