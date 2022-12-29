import {
  ResearchOutputResponse,
  ResearchOutputIdentifierType,
  DecisionOption,
  ResearchOutputPublishingEntities,
  TeamResponse,
} from '@asap-hub/model';
import { ComponentProps } from 'react';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';

export type ResearchOutputState = {
  title: string;
  description: string;
  link?: string;
  type: string | undefined;
  tags: readonly string[];
  methods: string[];
  organisms: string[];
  environments: string[];
  subtype?: string;
  labCatalogNumber?: string;
  teams: NonNullable<
    ComponentProps<typeof ResearchOutputContributorsCard>['teams']
  >;
  labs: ComponentProps<typeof ResearchOutputContributorsCard>['labs'];
  authors: ComponentProps<typeof ResearchOutputContributorsCard>['authors'];
  identifierType: ResearchOutputIdentifierType;
  identifier?: string;
  publishDate: Date | undefined;
  asapFunded: DecisionOption;
  usedInPublication: DecisionOption;
};

export type getTeamState = {
  team: TeamResponse | undefined;
  publishingEntity: ResearchOutputPublishingEntities;
  researchOutputData: ResearchOutputResponse | undefined;
};

const equals = (a: Array<string>, b: Array<string>): boolean =>
  a.length === b.length && a.every((element, index) => element === b[index]);

export const getTeamsState = ({
  team,
  publishingEntity,
  researchOutputData,
}: getTeamState) => {
  if (publishingEntity === 'Working Group') {
    return [];
  }
  return (
    researchOutputData?.teams.map((element) => ({
      label: element.displayName,
      value: element.id,
      isFixed: true,
    })) || [
      {
        label: team?.displayName || '',
        value: team?.id || '',
        isFixed: true,
      },
    ]
  );
};

export function isDirty(
  initialState: ResearchOutputState | undefined,
  currentState: ResearchOutputState,
): boolean {
  if (typeof initialState === 'undefined') return false;
  return (
    initialState.title !== currentState.title ||
    initialState.description !== currentState.description ||
    initialState.link !== currentState.link ||
    initialState.type !== currentState.type ||
    !equals(initialState.methods, currentState.methods) ||
    !equals(initialState.organisms, currentState.organisms) ||
    !equals(initialState.environments, currentState.environments) ||
    !equals(
      initialState.teams.map((team) => team.value),
      currentState.teams.map((team) => team.value),
    ) ||
    (initialState.labs &&
      currentState.labs &&
      !equals(
        initialState.labs.map((lab) => lab.value),
        currentState.labs.map((lab) => lab.value),
      )) ||
    (initialState.authors &&
      currentState.authors &&
      !equals(
        initialState.authors.map((author) => author.value),
        currentState.authors.map((author) => author?.value),
      )) ||
    initialState.subtype !== currentState.subtype ||
    initialState.identifierType !== currentState.identifierType
  );
}

export function getInitialState(
  researchOutputData: ResearchOutputResponse | undefined,
  team: TeamResponse | undefined,
  publishingEntity: ResearchOutputPublishingEntities,
  isEditMode: boolean,
): ResearchOutputState {
  if (researchOutputData) {
    return {
      title: researchOutputData.title,
      type: researchOutputData.type,
      tags: researchOutputData.tags,
      description: researchOutputData.description,
      methods: researchOutputData.methods,
      organisms: researchOutputData.organisms,
      environments: researchOutputData.environments,
      identifierType: getIdentifierType(isEditMode, researchOutputData),
      labCatalogNumber: researchOutputData.labCatalogNumber || '',
      link: researchOutputData.link,
      subtype: researchOutputData.subtype,
      labs: researchOutputData.labs.map((lab) => ({
        value: lab.id,
        label: lab.name,
      })),
      authors: researchOutputData.authors.map((author) => ({
        value: author.id,
        label: author.displayName,
        user: author,
      })),
      teams: getTeamsState({
        team,
        researchOutputData,
        publishingEntity,
      }),
      identifier:
        researchOutputData?.doi ||
        researchOutputData?.rrid ||
        researchOutputData?.accession ||
        '',
      publishDate: getPublishDate(researchOutputData.publishDate),
      asapFunded: getDecision(researchOutputData.asapFunded),
      usedInPublication: getDecision(researchOutputData.usedInPublication),
    };
  }
  return {
    title: '',
    type: '',
    tags: [],
    description: '',
    methods: [],
    organisms: [],
    environments: [],
    identifierType: getIdentifierType(isEditMode, researchOutputData),
    labCatalogNumber: '',
    labs: [],
    link: '',
    authors: [],
    teams: getTeamsState({
      team,
      researchOutputData,
      publishingEntity,
    }),
    identifier: '',
    publishDate: undefined,
    asapFunded: 'Not Sure',
    usedInPublication: 'Not Sure',
  };
}

const identifierTypeToFieldName: Record<
  ResearchOutputIdentifierType,
  'doi' | 'accession' | 'labCatalogNumber' | 'rrid' | undefined
> = {
  [ResearchOutputIdentifierType.Empty]: undefined,
  [ResearchOutputIdentifierType.None]: undefined,
  [ResearchOutputIdentifierType.DOI]: 'doi',
  [ResearchOutputIdentifierType.AccessionNumber]: 'accession',
  [ResearchOutputIdentifierType.RRID]: 'rrid',
};

export const createIdentifierField = (
  identifierType: ResearchOutputIdentifierType,
  rawIdentifier: string,
):
  | { rrid: string }
  | { doi: string }
  | { accession: string }
  | Record<never, never> => {
  const fieldName = identifierTypeToFieldName[identifierType];
  if (fieldName) {
    return { [fieldName]: rawIdentifier };
  }

  return {};
};

export const getIdentifierType = (
  isEditMode: boolean,
  researchOutputData?: ResearchOutputResponse,
): ResearchOutputIdentifierType => {
  if (researchOutputData?.doi) return ResearchOutputIdentifierType.DOI;

  if (researchOutputData?.accession)
    return ResearchOutputIdentifierType.AccessionNumber;

  if (researchOutputData?.rrid) return ResearchOutputIdentifierType.RRID;

  return isEditMode
    ? ResearchOutputIdentifierType.None
    : ResearchOutputIdentifierType.Empty;
};

export const isIdentifierModified = (
  researchOutputData: ResearchOutputResponse,
  identifier?: string,
): boolean =>
  researchOutputData.doi !== identifier &&
  researchOutputData.accession !== identifier &&
  researchOutputData.rrid !== identifier &&
  identifier !== '';

export const getPublishDate = (publishDate?: string): Date | undefined => {
  if (publishDate) {
    return new Date(publishDate);
  }
  return undefined;
};

export const getDecision = (decision?: boolean): DecisionOption =>
  decision === undefined ? 'Not Sure' : decision ? 'Yes' : 'No';
