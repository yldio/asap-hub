import { css } from '@emotion/react';
import {
  convertDecisionToBoolean,
  DecisionOption,
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputPublishingEntities,
  ResearchOutputPutRequest,
  ResearchOutputResponse,
  ResearchTagResponse,
  TeamResponse,
} from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { isInternalUser } from '@asap-hub/validation';
import React, { ComponentProps, useEffect, useState } from 'react';
import { contentSidePaddingWithNavigation } from '../layout';
import {
  Form,
  ResearchOutputExtraInformationCard,
  ResearchOutputFormSharingCard,
  ResearchOutputHeader,
} from '../organisms';
import { mobileScreen, perRem } from '../pixels';
import { Button } from '../atoms';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';
import { usePushFromHere } from '../routing';
import {
  noop,
  ResearchOutputState,
  getInitialState,
  getTeamsState,
  getDecision,
  getPublishDate,
  getIdentifierType,
  isDirty,
  createIdentifierField,
} from '../utils';

type ResearchOutputPageProps = Pick<
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
    team?: TeamResponse;
    researchOutputData?: ResearchOutputResponse;
    isEditMode: boolean;
    publishingEntity?: ResearchOutputPublishingEntities;
    tagSuggestions: string[];
  } & ComponentProps<typeof ResearchOutputHeader>;

const mainStyles = css({
  padding: `${36 / perRem}em ${contentSidePaddingWithNavigation(8)} ${
    48 / perRem
  }em `,
});

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

const ResearchOutputPage: React.FC<ResearchOutputPageProps> = ({
  documentType,
  researchOutputData,
  isEditMode,
  publishingEntity = 'Team',
  onSave,
  tagSuggestions,
  getLabSuggestions = noop,
  getTeamSuggestions = noop,
  getAuthorSuggestions = noop,
  researchTags,
  team,
  serverValidationErrors,
  clearServerValidationError,
}) => {
  const historyPush = usePushFromHere();
  const [initialState, setInitialState] = useState<
    ResearchOutputState | undefined
  >();

  useEffect(() => {
    setInitialState(
      getInitialState(researchOutputData, team, publishingEntity),
    );
  }, [researchOutputData, team, publishingEntity]);

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
  >(getTeamsState({ team, publishingEntity, researchOutputData }));

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
      getIdentifierType(researchOutputData),
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
    researchOutputData?.subtype,
  );

  const filteredResearchTags = researchTags.filter((d) =>
    d.types?.includes(type),
  );

  const currentState: ResearchOutputState = {
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
    publishDate,
    usedInPublication,
    asapFunded,
  };

  return (
    <>
      <ResearchOutputHeader
        documentType={documentType}
        publishingEntity={publishingEntity}
      />
      <main css={mainStyles}>
        <Form<ResearchOutputResponse>
          serverErrors={serverValidationErrors}
          dirty={isDirty(initialState, currentState)}
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
              publishingEntity,
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
                publishingEntity={publishingEntity}
              />
              <ResearchOutputExtraInformationCard
                documentType={documentType}
                isSaving={isSaving}
                researchTags={filteredResearchTags}
                tagSuggestions={tagSuggestions.map((suggestion) => ({
                  label: suggestion,
                  value: suggestion,
                }))}
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
                publishingEntity={publishingEntity}
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
      </main>
    </>
  );
};

export default ResearchOutputPage;
