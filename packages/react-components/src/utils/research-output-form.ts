import {
  ResearchOutputResponse,
  ResearchOutputIdentifierType,
  DecisionOption,
  ResearchOutputPublishingEntities,
  TeamResponse,
  ResearchOutputPostRequest,
  convertDecisionToBoolean,
  ResearchOutputDocumentType,
} from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { ComponentProps } from 'react';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';

export type getTeamState = {
  team: TeamResponse | undefined;
  publishingEntity: ResearchOutputPublishingEntities;
  researchOutputData: ResearchOutputResponse | undefined;
};

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
  researchOutputData?: ResearchOutputResponse,
): ResearchOutputIdentifierType => {
  if (researchOutputData?.doi) return ResearchOutputIdentifierType.DOI;

  if (researchOutputData?.accession)
    return ResearchOutputIdentifierType.AccessionNumber;

  if (researchOutputData?.rrid) return ResearchOutputIdentifierType.RRID;

  return researchOutputData
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

export type ResearchOutputPayload = {
  identifierType: ResearchOutputIdentifierType;
  identifier: string;
  documentType: ResearchOutputDocumentType;
  tags: ResearchOutputPostRequest['tags'];
  link: ResearchOutputPostRequest['link'];
  description: ResearchOutputPostRequest['description'];
  title: ResearchOutputPostRequest['title'];
  type: ResearchOutputPostRequest['type'] | '';
  authors: NonNullable<
    ComponentProps<typeof ResearchOutputContributorsCard>['authors']
  >;
  labs: NonNullable<
    ComponentProps<typeof ResearchOutputContributorsCard>['labs']
  >;
  teams: NonNullable<
    ComponentProps<typeof ResearchOutputContributorsCard>['teams']
  >;
  usageNotes: ResearchOutputPostRequest['usageNotes'];
  asapFunded: DecisionOption;
  usedInPublication: DecisionOption;
  sharingStatus: ResearchOutputPostRequest['sharingStatus'];
  publishDate?: Date;
  labCatalogNumber: ResearchOutputPostRequest['labCatalogNumber'];
  methods: string[];
  organisms: string[];
  environments: string[];
  subtype?: string;
};

export const getPayload = ({
  identifierType,
  identifier,
  documentType,
  tags,
  link,
  description,
  title,
  type,
  authors,
  labs,
  teams,
  usageNotes,
  asapFunded,
  usedInPublication,
  sharingStatus,
  publishDate,
  labCatalogNumber,
  methods,
  organisms,
  environments,
  subtype,
}: ResearchOutputPayload): Omit<
  ResearchOutputPostRequest,
  'publishingEntity'
> => ({
  ...createIdentifierField(identifierType, identifier),
  documentType,
  tags,
  link: String(link).trim() === '' ? undefined : link,
  description,
  title,
  type: type as ResearchOutputPostRequest['type'],
  authors: authors.map(({ value, user }) =>
    !user
      ? { externalAuthorName: value }
      : isInternalUser(user)
      ? { userId: value }
      : { externalAuthorId: value },
  ),
  labs: labs.map(({ value }) => value),
  teams: teams.map(({ value }) => value),
  usageNotes,
  asapFunded: convertDecisionToBoolean(asapFunded),
  usedInPublication: convertDecisionToBoolean(usedInPublication),
  sharingStatus,
  publishDate: publishDate?.toISOString(),
  workingGroups: [],
  labCatalogNumber: labCatalogNumber || undefined,
  methods,
  organisms,
  environments,
  subtype,
});
