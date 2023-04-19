import {
  ResearchOutputResponse,
  ResearchOutputIdentifierType,
  DecisionOption,
  TeamResponse,
  ResearchOutputPostRequest,
  convertDecisionToBoolean,
  ResearchOutputDocumentType,
} from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { ComponentProps, ComponentPropsWithRef } from 'react';
import AuthorSelect from '../organisms/AuthorSelect';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';
import ResearchOutputRelatedResearchCard from '../organisms/ResearchOutputRelatedResearchCard';
import { MultiSelectOptionsType } from '../atoms';

export type getTeamState = {
  team: TeamResponse | undefined;
  researchOutputData: ResearchOutputResponse | undefined;
};

export type ResearchOutputOption = Pick<
  ResearchOutputResponse,
  'type' | 'documentType'
> &
  MultiSelectOptionsType;

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

export const getPostAuthors = (
  authors: ComponentPropsWithRef<typeof AuthorSelect>['values'],
) =>
  authors?.map(({ value, author }) => {
    if (author) {
      return isInternalUser(author)
        ? { userId: value }
        : { externalAuthorId: value };
    }
    return { externalAuthorName: value };
  });
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
  descriptionMD: ResearchOutputPostRequest['descriptionMD'];
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
  relatedResearch: NonNullable<
    ComponentProps<typeof ResearchOutputRelatedResearchCard>['relatedResearch']
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
  keywords: string[];
};

export const getPayload = ({
  identifierType,
  identifier,
  documentType,
  tags,
  link,
  description,
  descriptionMD,
  title,
  type,
  authors,
  labs,
  teams,
  relatedResearch,
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
  keywords,
}: ResearchOutputPayload): ResearchOutputPostRequest => ({
  ...createIdentifierField(identifierType, identifier),
  documentType,
  tags,
  link: String(link).trim() === '' ? undefined : link,
  description,
  descriptionMD,
  title,
  type: type as ResearchOutputPostRequest['type'],
  authors: getPostAuthors(authors),
  labs: labs.map(({ value }) => value),
  teams: teams.map(({ value }) => value),
  relatedResearch: relatedResearch.map(({ value }) => value),
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
  keywords,
});
