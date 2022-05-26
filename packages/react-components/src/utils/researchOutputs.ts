import { ComponentProps } from 'react';
import {
  ResearchOutputResponse,
  ResearchOutputIdentifierType,
} from '@asap-hub/model';
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
  teams: ComponentProps<typeof ResearchOutputContributorsCard>['teams'];
  labs: ComponentProps<typeof ResearchOutputContributorsCard>['labs'];
  authors: ComponentProps<typeof ResearchOutputContributorsCard>['authors'];
  identifierType?: ResearchOutputIdentifierType;
  identifier?: string;
};

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
): boolean {
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
      subtype !== researchOutputData.subtype ||
      identifierType !== getIdentifierType(researchOutputData) ||
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
    teams?.length !== 1 ||
    identifier !== '' ||
    identifierType !== ResearchOutputIdentifierType.Empty
  );
}

export function equals(a: Array<string>, b: Array<string>): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}
export function getIdentifierType(
  researchOutputData: ResearchOutputResponse,
): ResearchOutputIdentifierType {
  if (researchOutputData?.doi) return ResearchOutputIdentifierType.DOI;

  if (researchOutputData?.accession)
    return ResearchOutputIdentifierType.AccessionNumber;

  if (researchOutputData?.rrid) return ResearchOutputIdentifierType.RRID;

  return ResearchOutputIdentifierType.Empty;
}

export function isIdentifierModified(
  researchOutputData: ResearchOutputResponse,
  identifier?: string,
): boolean {
  return (
    researchOutputData.doi !== identifier &&
    researchOutputData.accession !== identifier &&
    researchOutputData.rrid !== identifier
  );
}

export function getPublishDate(publishDate?: string): Date | undefined {
  if (publishDate) {
    return new Date(publishDate);
  }
  return undefined;
}
