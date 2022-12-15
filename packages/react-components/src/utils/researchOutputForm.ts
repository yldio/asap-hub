import {
  ResearchOutputResponse,
  ResearchOutputIdentifierType,
  DecisionOption,
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

function equals(a: Array<string>, b: Array<string>): boolean {
  return (
    a.length === b.length && a.every((element, index) => element === b[index])
  );
}

export function isDirty(
  {
    title,
    description,
    link,
    tags,
    type,
    methods,
    organisms,
    environments,
    teams,
    labs,
    authors,
    subtype,
    labCatalogNumber,
    identifierType,
    identifier,
  }: ResearchOutputState,
  researchOutputData?: ResearchOutputResponse,
  publishingEntity?: string,
): boolean {
  let defaultTeamsLength = 1;
  if (publishingEntity === 'Working Group') {
    defaultTeamsLength = 0;
  }
  if (researchOutputData) {
    return (
      title !== researchOutputData.title ||
      description !== researchOutputData.description ||
      link !== researchOutputData.link ||
      type !== researchOutputData.type ||
      !equals(methods, researchOutputData.methods) ||
      !equals(organisms, researchOutputData.organisms) ||
      !equals(environments, researchOutputData.environments) ||
      !equals(
        teams.map((team) => team.value),
        researchOutputData.teams.map((team) => team.id),
      ) ||
      (labs &&
        !equals(
          labs.map((lab) => lab.value),
          researchOutputData.labs.map((lab) => lab.id),
        )) ||
      (authors &&
        !equals(
          authors.map((author) => author.value),
          researchOutputData.authors.map((author) => author?.id),
        )) ||
      subtype !== researchOutputData.subtype ||
      identifierType !== getIdentifierType(true, researchOutputData) ||
      isIdentifierModified(researchOutputData, identifier)
    );
  }
  return (
    tags?.length !== 0 ||
    title !== '' ||
    description !== '' ||
    link !== '' ||
    type !== '' ||
    labs?.length !== 0 ||
    authors?.length !== 0 ||
    methods.length !== 0 ||
    organisms.length !== 0 ||
    environments.length !== 0 ||
    labCatalogNumber !== '' ||
    subtype !== undefined ||
    teams?.length !== defaultTeamsLength ||
    identifier !== '' ||
    identifierType !== ResearchOutputIdentifierType.Empty
  );
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

export function createIdentifierField(
  identifierType: ResearchOutputIdentifierType,
  rawIdentifier: string,
):
  | { rrid: string }
  | { doi: string }
  | { accession: string }
  | Record<never, never> {
  const fieldName = identifierTypeToFieldName[identifierType];
  if (fieldName) {
    return { [fieldName]: rawIdentifier };
  }

  return {};
}

export function getIdentifierType(
  isEditMode: boolean,
  researchOutputData?: ResearchOutputResponse,
): ResearchOutputIdentifierType {
  if (researchOutputData?.doi) return ResearchOutputIdentifierType.DOI;

  if (researchOutputData?.accession)
    return ResearchOutputIdentifierType.AccessionNumber;

  if (researchOutputData?.rrid) return ResearchOutputIdentifierType.RRID;

  return isEditMode
    ? ResearchOutputIdentifierType.None
    : ResearchOutputIdentifierType.Empty;
}

export function isIdentifierModified(
  researchOutputData: ResearchOutputResponse,
  identifier?: string,
): boolean {
  return (
    researchOutputData.doi !== identifier &&
    researchOutputData.accession !== identifier &&
    researchOutputData.rrid !== identifier &&
    identifier !== ''
  );
}

export function getPublishDate(publishDate?: string): Date | undefined {
  if (publishDate) {
    return new Date(publishDate);
  }
  return undefined;
}

export function getDecision(decision?: boolean): DecisionOption {
  return decision === undefined ? 'Not Sure' : decision ? 'Yes' : 'No';
}
