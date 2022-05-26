import { ComponentProps } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import {
  ResearchOutputResponse,
  ResearchOutputIdentifierType,
} from '@asap-hub/model';
import {
  googleDriveIcon,
  protocolsIcon,
  slackIcon,
  googleCalendarIcon,
} from '../icons';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';

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

type ResearchOutputState = {
  title: string;
  description: string;
  link: string | undefined;
  type: string;
  tags: string[];
  methods: string[];
  organisms: string[];
  environments: string[];
  subtype: string | undefined;
  labCatalogNumber: string | undefined;
  teams: ComponentProps<typeof ResearchOutputContributorsCard>['teams'];
  labs: ComponentProps<typeof ResearchOutputContributorsCard>['labs'];
  authors: ComponentProps<typeof ResearchOutputContributorsCard>['authors'];
};

export const isDirty = (
  {
    title,
    description,
    link,
    type,
    tags,
    methods,
    organisms,
    environments,
    teams,
    labs,
    authors,
    subtype,
    labCatalogNumber,
  }: ResearchOutputState,
  researchOutputData?: ResearchOutputResponse,
): boolean => {
  if (researchOutputData) {
    return (
      title !== researchOutputData.title ||
      description !== researchOutputData.description ||
      link !== researchOutputData.link ||
      type !== researchOutputData.type ||
      !equals(methods, researchOutputData.methods) ||
      !equals(organisms, researchOutputData.organisms) ||
      !equals(environments, researchOutputData.environments) ||
      teams?.length !== researchOutputData?.teams.length ||
      labs?.length !== researchOutputData?.labs.length ||
      authors?.length !== researchOutputData.authors.length ||
      subtype !== researchOutputData.subtype
    );
  }
  return (
    tags?.length !== 0 ||
    title !== '' ||
    description !== '' ||
    link !== '' ||
    type !== undefined ||
    labs?.length !== 0 ||
    authors?.length !== 0 ||
    methods.length !== 0 ||
    organisms.length !== 0 ||
    environments.length !== 0 ||
    labCatalogNumber !== '' ||
    subtype !== undefined ||
    teams?.length !== 1
  );
};

export const equals = (a: Array<string>, b: Array<string>): boolean =>
  JSON.stringify(a) === JSON.stringify(b);

export const getIdentifierType = (
  researchOutputData: ResearchOutputResponse,
): ResearchOutputIdentifierType => {
  if (researchOutputData?.doi) return ResearchOutputIdentifierType.DOI;

  if (researchOutputData?.accession)
    return ResearchOutputIdentifierType.AccessionNumber;

  if (researchOutputData?.rrid) return ResearchOutputIdentifierType.RRID;

  return ResearchOutputIdentifierType.Empty;
};
