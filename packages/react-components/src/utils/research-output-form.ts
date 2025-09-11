import {
  convertDecisionToBoolean,
  DecisionOption,
  ResearchOutputDataObject,
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
  ResearchOutputResponse,
  TeamResponse,
} from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { ComponentProps, ComponentPropsWithRef } from 'react';
import { OptionsType } from 'react-select';
import { MultiSelectOptionsType } from '../atoms';
import { ResearchOutputRelatedEventsCard } from '../organisms';
import AuthorSelect, { AuthorOption } from '../organisms/AuthorSelect';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';
import ResearchOutputRelatedResearchCard from '../organisms/ResearchOutputRelatedResearchCard';

export type getTeamState = {
  team: TeamResponse | undefined;
  researchOutputData: ResearchOutputResponse | undefined;
};

export type ResearchOutputOption = {
  documentType: string;
  type?: string;
} & MultiSelectOptionsType;

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

export const getPostAuthors = (
  authors: ComponentPropsWithRef<typeof AuthorSelect>['values'],
) =>
  (authors as OptionsType<AuthorOption>)?.map(({ value, author }) => {
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

export const getDecision = (
  decision?: boolean,
  documentType?: ResearchOutputDocumentType,
): DecisionOption => {
  if (documentType === 'Article' && decision === undefined) {
    return 'Yes';
  }
  return decision === undefined ? 'Not Sure' : decision ? 'Yes' : 'No';
};

export const getSharingStatus = (
  sharingStatus?: ResearchOutputPostRequest['sharingStatus'],
  documentType?: ResearchOutputDocumentType,
): ResearchOutputPostRequest['sharingStatus'] => {
  if (sharingStatus !== undefined) {
    return sharingStatus;
  }
  return documentType === 'Article' ? 'Public' : 'Network Only';
};

export const getOwnRelatedResearchLinks = (
  relatedResearch?: ResearchOutputDataObject['relatedResearch'],
) =>
  relatedResearch
    ?.filter(({ isOwnRelatedResearchLink }) => !!isOwnRelatedResearchLink)
    .map((research) => ({
      value: research.id,
      label: research.title,
      type: research.type,
      documentType: research.documentType,
    })) || [];

export type ResearchOutputPayload = {
  identifierType: ResearchOutputIdentifierType;
  identifier: string;
  documentType: ResearchOutputDocumentType;
  link: ResearchOutputPostRequest['link'];
  description: ResearchOutputPostRequest['description'];
  descriptionMD: ResearchOutputPostRequest['descriptionMD'];
  shortDescription: ResearchOutputPostRequest['shortDescription'];
  changelog: ResearchOutputPostRequest['changelog'];
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
  published: boolean;
  relatedEvents: NonNullable<
    ComponentProps<typeof ResearchOutputRelatedEventsCard>['relatedEvents']
  >;
  impact?: string;
  categories?: string[];
  relatedManuscriptVersion?: string;
  relatedManuscript?: string;
};

export const getPayload = ({
  identifierType,
  identifier,
  documentType,
  link,
  description,
  descriptionMD,
  shortDescription,
  changelog,
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
  published,
  relatedEvents,
  impact,
  categories,
  relatedManuscriptVersion,
  relatedManuscript,
}: ResearchOutputPayload): ResearchOutputPostRequest => ({
  ...createIdentifierField(identifierType, identifier),
  documentType,
  link: String(link).trim() === '' ? undefined : link,
  description,
  descriptionMD,
  shortDescription,
  changelog,
  title,
  type: type as ResearchOutputPostRequest['type'],
  authors: getPostAuthors(authors),
  labs: (labs as OptionsType<MultiSelectOptionsType>).map(({ value }) => value),
  teams: (teams as OptionsType<MultiSelectOptionsType>).map(
    ({ value }) => value,
  ),
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
  published,
  relatedEvents: relatedEvents.map(({ value }) => value),
  impact,
  categories,
  relatedManuscriptVersion,
  relatedManuscript,
});

export function transformResearchOutputResponseToRequest({
  authors,
  teams,
  labs,
  relatedResearch,
  documentType,
  link,
  description,
  descriptionMD,
  shortDescription,
  changelog,
  title,
  type,
  usageNotes,
  asapFunded,
  usedInPublication,
  sharingStatus,
  publishDate,
  workingGroups,
  labCatalogNumber,
  methods,
  organisms,
  environments,
  subtype,
  keywords,
  published,
  statusChangedBy,
  relatedEvents,
  isInReview,
}: ResearchOutputResponse): ResearchOutputPutRequest {
  return {
    documentType,
    link,
    description,
    changelog,
    title,
    type,
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
    published,
    authors: getPostAuthors(
      authors.map((author) => ({
        author,
        value: author.id,
        label: author.displayName,
      })),
    ),
    descriptionMD: descriptionMD || '',
    shortDescription: shortDescription || '',
    labs: labs.map(({ id }) => id),
    teams: teams.map((team) => team.id),
    workingGroups: workingGroups ? workingGroups.map((wg) => wg.id) : [],
    relatedResearch: relatedResearch.map((research) => research.id),
    relatedEvents: relatedEvents.map((event) => event.id),
    statusChangedById: statusChangedBy ? statusChangedBy.id : undefined,
    isInReview,
  };
}
