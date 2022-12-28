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
  type: string;
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

export const isDirtyEditMode = (
  state: ResearchOutputState,
  researchOutputData: ResearchOutputResponse,
): boolean =>
  state.title !== researchOutputData.title ||
  state.description !== researchOutputData.description ||
  state.link !== researchOutputData.link ||
  state.type !== researchOutputData.type ||
  !equals(state.methods, researchOutputData.methods) ||
  !equals(state.organisms, researchOutputData.organisms) ||
  !equals(state.environments, researchOutputData.environments) ||
  !equals(
    state.teams.map((team) => team.value),
    researchOutputData.teams.map((team) => team.id),
  ) ||
  (state.labs &&
    !equals(
      state.labs.map((lab) => lab.value),
      researchOutputData.labs.map((lab) => lab.id),
    )) ||
  (state.authors &&
    !equals(
      state.authors.map((author) => author.value),
      researchOutputData.authors.map((author) => author?.id),
    )) ||
  state.subtype !== researchOutputData.subtype ||
  state.identifierType !== getIdentifierType(true, researchOutputData) ||
  isIdentifierModified(researchOutputData, state.identifier);

export const isDirtyTeams = (state: ResearchOutputState): boolean =>
  state.tags?.length !== 0 ||
  state.title !== '' ||
  state.description !== '' ||
  state.link !== '' ||
  state.type !== '' ||
  state.labs?.length !== 0 ||
  state.authors?.length !== 0 ||
  state.methods.length !== 0 ||
  state.organisms.length !== 0 ||
  state.environments.length !== 0 ||
  state.labCatalogNumber !== '' ||
  state.subtype !== undefined ||
  state.teams?.length !== 1 ||
  state.identifier !== '' ||
  state.identifierType !== ResearchOutputIdentifierType.Empty;

export const isDirtyWorkingGroups = (state: ResearchOutputState): boolean =>
  state.tags?.length !== 0 ||
  state.title !== '' ||
  state.description !== '' ||
  state.link !== '' ||
  state.type !== '' ||
  state.labs?.length !== 0 ||
  state.authors?.length !== 0 ||
  state.methods.length !== 0 ||
  state.organisms.length !== 0 ||
  state.environments.length !== 0 ||
  state.labCatalogNumber !== '' ||
  state.subtype !== undefined ||
  state.teams?.length !== 0 ||
  state.identifier !== '' ||
  state.identifierType !== ResearchOutputIdentifierType.Empty;

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
