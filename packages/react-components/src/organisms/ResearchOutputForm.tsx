import {
  convertDecisionToBoolean,
  DecisionOption,
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputPutRequest,
  ResearchOutputResponse,
  ResearchTagResponse,
  TeamResponse,
} from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { isInternalUser } from '@asap-hub/validation';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import { Button } from '../atoms';
import { mobileScreen, perRem } from '../pixels';
import { usePushFromHere } from '../routing';
import { equals, noop } from '../utils';
import {
  Form,
  ResearchOutputExtraInformationCard,
  ResearchOutputFormSharingCard,
} from './index';
import ResearchOutputContributorsCard from './ResearchOutputContributorsCard';

const contentStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  maxWidth: `${800 / perRem}em`,
  justifyContent: 'center',
  gridAutoFlow: 'row',
  rowGap: `${36 / perRem}em`,
});

const formControlsContainerStyles = css({
  display: 'flex',
  justifyContent: 'end',
  paddingBottom: `${200 / perRem}em`, // Hack for labs selector
});

const formControlsStyles = css({
  display: 'grid',
  alignItems: 'end',
  gridGap: `${24 / perRem}em`,
  gridTemplateColumns: '1fr 1fr',
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    gridTemplateColumns: '1fr',
    width: '100%',
    'button:nth-of-type(1)': {
      order: 2,
      margin: '0',
    },
    'button:nth-of-type(2)': {
      order: 1,
      margin: '0',
    },
  },
});

type ResearchOutputFormProps = Pick<
  ComponentProps<typeof ResearchOutputExtraInformationCard>,
  'tagSuggestions'
> &
  Pick<
    ComponentProps<typeof ResearchOutputFormSharingCard>,
    'serverValidationErrors' | 'clearServerValidationError'
  > &
  Pick<
    ComponentProps<typeof ResearchOutputContributorsCard>,
    'getLabSuggestions' | 'getAuthorSuggestions' | 'getTeamSuggestions'
  > & {
    onSave: (
      output: ResearchOutputPostRequest | ResearchOutputPutRequest,
    ) => Promise<ResearchOutputResponse | void>;
    researchTags: ResearchTagResponse[];
    documentType: ResearchOutputDocumentType;
    team: TeamResponse;
    researchOutputData?: ResearchOutputResponse;
    isEditMode: boolean;
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
    teams?.length !== 1 ||
    identifier !== '' ||
    identifierType !== ResearchOutputIdentifierType.Empty
  );
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
    researchOutputData.rrid !== identifier
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

const ResearchOutputForm: React.FC<ResearchOutputFormProps> = ({
  onSave,
  tagSuggestions,
  documentType,
  getLabSuggestions = noop,
  getTeamSuggestions = noop,
  getAuthorSuggestions = noop,
  researchTags,
  team,
  serverValidationErrors,
  clearServerValidationError,
  researchOutputData,
  isEditMode,
}) => {
  const historyPush = usePushFromHere();
  const [tags, setTags] = useState<ResearchOutputPostRequest['tags']>(
    (researchOutputData?.tags as string[]) || [],
  );
  const [type, setType] = useState<ResearchOutputPostRequest['type'] | ''>(
    researchOutputData?.type || '',
  );
  const [title, setTitle] = useState<ResearchOutputPostRequest['title']>(
    researchOutputData?.title || '',
  );
  const [labCatalogNumber, setLabCatalogNumber] = useState<
    ResearchOutputPostRequest['labCatalogNumber']
  >(researchOutputData?.labCatalogNumber || '');
  const [labs, setLabs] = useState<
    NonNullable<ComponentProps<typeof ResearchOutputContributorsCard>['labs']>
  >(
    researchOutputData?.labs.map((lab) => ({
      value: lab.id,
      label: lab.name,
    })) || [],
  );
  const [authors, setAuthors] = useState<
    NonNullable<
      ComponentProps<typeof ResearchOutputContributorsCard>['authors']
    >
  >(
    researchOutputData?.authors.map((author) => ({
      value: author.id,
      label: author.displayName,
      user: author,
    })) || [],
  );

  const [teams, setTeams] = useState<
    NonNullable<ComponentProps<typeof ResearchOutputContributorsCard>['teams']>
  >(
    researchOutputData?.teams.map((element, index) => ({
      label: element.displayName,
      value: element.id,
      isFixed: true,
    })) || [{ label: team.displayName, value: team.id, isFixed: true }],
  );

  const [description, setDescription] = useState<
    ResearchOutputPostRequest['description']
  >(researchOutputData?.description || '');
  const [link, setLink] = useState<ResearchOutputPostRequest['link']>(
    researchOutputData?.link || '',
  );
  const [usageNotes, setUsageNotes] = useState<
    ResearchOutputPostRequest['usageNotes']
  >(researchOutputData?.usageNotes || '');
  const [asapFunded, setAsapFunded] = useState<DecisionOption>(
    getDecision(researchOutputData?.asapFunded),
  );

  const [usedInPublication, setUsedInPublication] = useState<DecisionOption>(
    getDecision(researchOutputData?.usedInPublication),
  );

  const [sharingStatus, setSharingStatus] = useState<
    ResearchOutputPostRequest['sharingStatus']
  >(researchOutputData?.sharingStatus || 'Network Only');

  const [publishDate, setPublishDate] = useState<Date | undefined>(
    getPublishDate(researchOutputData?.publishDate) || undefined,
  );

  const [identifierType, setIdentifierType] =
    useState<ResearchOutputIdentifierType>(
      getIdentifierType(isEditMode, researchOutputData),
    );
  const [identifier, setIdentifier] = useState<string>(
    researchOutputData?.doi ||
      researchOutputData?.rrid ||
      researchOutputData?.accession ||
      '',
  );

  const [methods, setMethods] = useState<string[]>(
    researchOutputData?.methods || [],
  );
  const [organisms, setOrganisms] = useState<string[]>(
    researchOutputData?.organisms || [],
  );
  const [environments, setEnvironments] = useState<string[]>(
    researchOutputData?.environments || [],
  );
  const [subtype, setSubtype] = useState<string | undefined>(
    researchOutputData?.subtype || '',
  );

  const filteredResearchTags = researchTags.filter((d) =>
    d.types?.includes(type),
  );

  return (
    <Form<ResearchOutputResponse>
      serverErrors={serverValidationErrors}
      dirty={isDirty(
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
        },
        researchOutputData,
      )}
      onSave={() => {
        const identifierField = createIdentifierField(
          identifierType,
          identifier,
        );

        /* istanbul ignore next */
        if (!type) {
          throw new Error('There is no type provided.');
        }

        return onSave({
          ...identifierField,
          documentType,
          tags,
          link: String(link).trim() === '' ? undefined : link,
          description,
          title,
          type,
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
          labCatalogNumber:
            documentType === 'Lab Resource' && labCatalogNumber !== ''
              ? labCatalogNumber
              : undefined,
          methods,
          organisms,
          environments,
          subtype,
        });
      }}
    >
      {({ isSaving, onSave: handleSave, onCancel: handleCancel }) => (
        <div css={contentStyles}>
          <ResearchOutputFormSharingCard
            documentType={documentType}
            serverValidationErrors={serverValidationErrors}
            clearServerValidationError={clearServerValidationError}
            isSaving={isSaving}
            description={description}
            onChangeDescription={setDescription}
            title={title}
            onChangeTitle={setTitle}
            link={link}
            onChangeLink={setLink}
            type={type}
            onChangeType={(newType) => {
              setType(newType);
              setMethods([]);
              setOrganisms([]);
              setEnvironments([]);
              setSubtype(undefined);
            }}
            subtype={subtype}
            onChangeSubtype={setSubtype}
            researchTags={filteredResearchTags}
            asapFunded={asapFunded}
            onChangeAsapFunded={setAsapFunded}
            usedInPublication={usedInPublication}
            onChangeUsedInPublication={setUsedInPublication}
            sharingStatus={sharingStatus}
            onChangeSharingStatus={setSharingStatus}
            publishDate={publishDate}
            onChangePublishDate={(date) =>
              setPublishDate(date ? new Date(date) : undefined)
            }
          />
          <ResearchOutputExtraInformationCard
            documentType={documentType}
            isSaving={isSaving}
            researchTags={filteredResearchTags}
            tagSuggestions={tagSuggestions}
            tags={tags}
            onChangeTags={setTags}
            usageNotes={usageNotes}
            onChangeUsageNotes={setUsageNotes}
            identifier={identifier}
            setIdentifier={setIdentifier}
            identifierType={identifierType}
            setIdentifierType={setIdentifierType}
            labCatalogNumber={labCatalogNumber}
            onChangeLabCatalogNumber={setLabCatalogNumber}
            methods={methods}
            onChangeMethods={setMethods}
            organisms={organisms}
            onChangeOrganisms={setOrganisms}
            environments={environments}
            onChangeEnvironments={setEnvironments}
            type={type}
            isEditMode={isEditMode}
          />
          <ResearchOutputContributorsCard
            isSaving={isSaving}
            labs={labs}
            getLabSuggestions={getLabSuggestions}
            onChangeLabs={setLabs}
            authors={authors}
            getAuthorSuggestions={getAuthorSuggestions}
            onChangeAuthors={setAuthors}
            teams={teams}
            onChangeTeams={setTeams}
            getTeamSuggestions={getTeamSuggestions}
            isEditMode={isEditMode}
          />
          <div css={formControlsContainerStyles}>
            <div css={formControlsStyles}>
              <Button enabled={!isSaving} onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                enabled={!isSaving}
                primary
                onClick={async () => {
                  const researchOutput = await handleSave();
                  if (researchOutput) {
                    const { id } = researchOutput;
                    const path = sharedResearch({}).researchOutput({
                      researchOutputId: id,
                    }).$;
                    historyPush(path);
                  }
                  return researchOutput;
                }}
              >
                {isEditMode ? 'Save' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
};
export default ResearchOutputForm;
