import {
  DecisionOption,
  EventResponse,
  getResearchOutputFlowBehavior,
  ResearchOutputDocumentType,
  ResearchOutputFlowId,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { css } from '@emotion/react';

import {
  ResearchOutputAvailableActions,
  ResearchOutputPermissions,
} from '@asap-hub/react-context';
import { network, sharedResearch } from '@asap-hub/routing';
import equal from 'fast-deep-equal';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useMatch, useNavigate } from 'react-router';

import { OptionsType } from '../select';

import { Button, MultiSelectOptionsType } from '../atoms';
import { defaultPageLayoutPaddingStyle } from '../layout';
import {
  Form,
  ResearchOutputConfirmModal,
  ResearchOutputConfirmModalType,
  ResearchOutputExtraInformationCard,
  ResearchOutputFormSharingCard,
  ResearchOutputPublishingCard,
  ResearchOutputRelatedEventsCard,
} from '../organisms';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';
import ResearchOutputRelatedResearchCard from '../organisms/ResearchOutputRelatedResearchCard';
import { mobileScreen, rem } from '../pixels';

import {
  getDecision,
  getIconForDocumentType,
  getIdentifierType,
  getOwnRelatedResearchLinks,
  getPayload,
  getPublishDate,
  getSharingStatus,
  noop,
} from '../utils';
import { richTextToMarkdown } from '../utils/parsing';
import { SeenModalType } from '../organisms/ResearchOutputConfirmModal';

type ResearchOutputFormProps = Pick<
  ComponentProps<typeof ResearchOutputFormSharingCard>,
  | 'serverValidationErrors'
  | 'clearServerValidationError'
  | 'typeOptions'
  | 'urlRequired'
  | 'getShortDescriptionFromDescription'
  | 'getImpactSuggestions'
  | 'getCategorySuggestions'
> &
  Pick<
    ComponentProps<typeof ResearchOutputContributorsCard>,
    | 'getLabSuggestions'
    | 'getAuthorSuggestions'
    | 'getTeamSuggestions'
    | 'authorsRequired'
  > & {
    displayChangelog: boolean;
    versionAction?: 'create' | 'edit';
    onSave: (
      output: ResearchOutputPostRequest,
    ) => Promise<ResearchOutputResponse | void>;
    onSaveDraft: (
      output: ResearchOutputPostRequest,
    ) => Promise<ResearchOutputResponse | void>;
    published: boolean;
    documentType: ResearchOutputDocumentType;
    researchTags: ResearchTagResponse[];
    selectedTeams: NonNullable<
      ComponentProps<typeof ResearchOutputContributorsCard>['teams']
    >;
    getRelatedResearchSuggestions?: NonNullable<
      ComponentProps<
        typeof ResearchOutputRelatedResearchCard
      >['getRelatedResearchSuggestions']
    >;
    getRelatedEventSuggestions: NonNullable<
      ComponentProps<
        typeof ResearchOutputRelatedEventsCard
      >['getRelatedEventSuggestions']
    >;
    researchOutputData?: ResearchOutputResponse;
    tagSuggestions: string[];
    permissions: ResearchOutputPermissions;
    isImportedFromManuscript?: boolean;
    flowId: ResearchOutputFlowId;
    availableActions: ResearchOutputAvailableActions;
  };

const mainStyles = css({
  padding: defaultPageLayoutPaddingStyle,
});

const contentStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  maxWidth: rem(800),
  justifyContent: 'center',
  gridAutoFlow: 'row',
  rowGap: rem(32),
});

const formControlsContainerStyles = css({
  display: 'flex',
  justifyContent: 'end',
  paddingBottom: rem(200), // Hack for labs selector
  [`@media (max-width: 810px)`]: {
    justifySelf: 'end',
    width: '100%',
  },
});

const formControlsTwoButtonsStyles = css({
  display: 'grid',
  alignItems: 'end',
  gridGap: rem(24),
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

const formControlsThreeButtonsStyles = css({
  display: 'grid',
  alignItems: 'end',
  gap: rem(24),
  gridTemplateColumns: '1fr 1fr 1fr',
  [`@media (max-width: 1110px)`]: {
    gridTemplateColumns: '1fr',
    width: '100%',
    'button:nth-of-type(1)': {
      order: 3,
      margin: '0',
    },
    'button:nth-of-type(2)': {
      order: 2,
      margin: '0',
    },
    'button:nth-of-type(3)': {
      order: 1,
      margin: '0',
    },
  },
});

const ResearchOutputForm: React.FC<ResearchOutputFormProps> = ({
  displayChangelog,
  documentType,
  researchOutputData,
  onSave,
  onSaveDraft,
  tagSuggestions,
  urlRequired = true,
  authorsRequired = false,
  typeOptions,
  selectedTeams,
  getLabSuggestions = noop,
  getTeamSuggestions = noop,
  getAuthorSuggestions = noop,
  getImpactSuggestions,
  getCategorySuggestions = noop,
  getRelatedResearchSuggestions = noop,
  getRelatedEventSuggestions,
  getShortDescriptionFromDescription,
  researchTags,
  serverValidationErrors,
  clearServerValidationError,
  published,
  permissions,
  versionAction,
  isImportedFromManuscript,
  flowId,
  availableActions,
}) => {
  const navigate = useNavigate();
  const { canPublishResearchOutput } = permissions;

  // Single source of truth for the form's flow behavior, derived from the
  // flow registry keyed by the flow the page resolved for this output.
  const behavior = getResearchOutputFlowBehavior(flowId);

  const showSaveDraftButton = availableActions.canSaveDraft;

  const showPublishButton = canPublishResearchOutput;
  const displayThreeButtons = showSaveDraftButton && showPublishButton;

  const [type, setType] = useState<ResearchOutputPostRequest['type'] | ''>(
    researchOutputData?.type || undefined,
  );
  const [title, setTitle] = useState<ResearchOutputPostRequest['title']>(
    researchOutputData?.title || '',
  );
  const [impact, setImpact] = useState<
    | NonNullable<
        ComponentProps<typeof ResearchOutputFormSharingCard>['impact']
      >
    | undefined
  >(
    researchOutputData?.impact &&
      researchOutputData.impact.id &&
      researchOutputData.impact.name
      ? {
          value: researchOutputData.impact.id,
          label: researchOutputData.impact.name,
        }
      : {
          value: '',
          label: '',
        },
  );

  const [categories, setCategories] = useState<
    NonNullable<
      ComponentProps<typeof ResearchOutputFormSharingCard>['categories']
    >
  >(
    researchOutputData?.categories?.map((category) => ({
      value: category.id,
      label: category.name,
    })) || [],
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
      author,
      value: author.id,
      label: author.displayName,
    })) || [],
  );

  const [teams, setTeams] =
    useState<
      NonNullable<
        ComponentProps<typeof ResearchOutputContributorsCard>['teams']
      >
    >(selectedTeams);

  const [relatedResearch, setRelatedResearch] = useState<
    NonNullable<
      ComponentProps<
        typeof ResearchOutputRelatedResearchCard
      >['relatedResearch']
    >
  >(getOwnRelatedResearchLinks(researchOutputData?.relatedResearch));

  const [relatedEvents, setRelatedEvents] = useState<
    NonNullable<
      ComponentProps<typeof ResearchOutputRelatedEventsCard>['relatedEvents']
    >
  >(
    (researchOutputData?.relatedEvents ?? []).map(
      ({ title: label, id, endDate }) => ({
        value: id,
        label,
        endDate,
      }),
    ),
  );

  const [descriptionMD, setDescription] = useState<
    ResearchOutputPostRequest['descriptionMD']
  >(
    researchOutputData?.descriptionMD ||
      richTextToMarkdown(researchOutputData?.description),
  );
  const [shortDescription, setShortDescription] = useState<
    ResearchOutputPostRequest['shortDescription']
  >(researchOutputData?.shortDescription || '');

  const [layImpactStatement, setLayImpactStatement] = useState<
    ResearchOutputPostRequest['layImpactStatement']
  >(researchOutputData?.layImpactStatement || '');

  const [changelog, setChangelog] = useState<
    ResearchOutputPostRequest['changelog']
  >(versionAction === 'create' ? '' : researchOutputData?.changelog || '');

  const [alreadySeenModals, setAlreadySeenModals] = useState<
    Set<SeenModalType>
  >(() => new Set());

  const isModalAlreadySeen = (modal: SeenModalType) =>
    alreadySeenModals.has(modal);

  const promptDescriptionChange =
    descriptionMD === researchOutputData?.descriptionMD &&
    behavior.requiresSameDescriptionConfirm &&
    !isModalAlreadySeen('description-change');

  const promptNewVersion =
    behavior.requiresAddVersionConfirm && !isModalAlreadySeen('version');

  const [modal, setModal] = useState<ResearchOutputConfirmModalType>(null);

  const getDraftModal = (): ResearchOutputConfirmModalType =>
    promptDescriptionChange ? 'description-draft' : null;

  const getPublishModal = (): ResearchOutputConfirmModalType => {
    if (promptDescriptionChange) return 'description-publish';
    if (promptNewVersion) return 'version';
    if (behavior.requiresPublishConfirm) return 'confirm-publish';
    return null;
  };

  const [link, setLink] = useState<ResearchOutputPostRequest['link']>(
    researchOutputData?.link || '',
  );
  const [usageNotes, setUsageNotes] = useState<
    ResearchOutputPostRequest['usageNotes']
  >(researchOutputData?.usageNotesMD || researchOutputData?.usageNotes || '');
  const [asapFunded, setAsapFunded] = useState<DecisionOption>(
    getDecision(researchOutputData?.asapFunded),
  );

  const isCreatingTeamArticle = !!useMatch(
    network({})
      .teams({})
      .team({
        teamId: (teams as OptionsType<MultiSelectOptionsType>)[0]?.value || '',
      })
      .createOutput({
        outputDocumentType: 'article',
      }).$,
  );

  const isCreatingWorkingGroupArticle = !!useMatch(
    network({})
      .workingGroups({})
      .workingGroup({
        workingGroupId: researchOutputData?.workingGroups?.[0]?.id ?? '',
      })
      .createOutput({
        outputDocumentType: 'article',
      }).$,
  );

  const isCreatingOutput =
    isCreatingTeamArticle || isCreatingWorkingGroupArticle;

  const [usedInPublication, setUsedInPublication] = useState<DecisionOption>(
    getDecision(
      researchOutputData?.usedInPublication,
      isCreatingOutput ? documentType : undefined,
    ),
  );

  const [sharingStatus, setSharingStatus] = useState<
    ResearchOutputPostRequest['sharingStatus']
  >(
    getSharingStatus(
      researchOutputData?.sharingStatus,
      isCreatingOutput ? documentType : undefined,
    ),
  );

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

  const [keywords, setKeywords] = useState<string[]>(
    researchOutputData?.keywords || [],
  );

  const filteredResearchTags =
    type !== undefined
      ? researchTags.filter((d) => d.types?.includes(type))
      : [];

  const currentPayload = getPayload({
    identifierType,
    identifier,
    documentType,
    link,
    description: researchOutputData?.description || '',
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
    impact: (impact as MultiSelectOptionsType)?.value,
    layImpactStatement,
    categories: (categories as MultiSelectOptionsType[]).map(
      (category) => category.value,
    ),
  });
  const [remotePayload, setRemotePayload] = useState(currentPayload);

  const [isFormSubmitted, setIsFormSubmitted] = useState(false);

  useEffect(() => {
    if (isImportedFromManuscript) {
      setIdentifierType(ResearchOutputIdentifierType.DOI);
      setIdentifier(researchOutputData?.doi || '');
    }
  }, [isImportedFromManuscript, researchOutputData?.doi]);

  return (
    <main css={mainStyles}>
      <Form<ResearchOutputResponse>
        toastType="inner"
        serverErrors={serverValidationErrors}
        dirty={!equal(remotePayload, currentPayload)}
      >
        {({
          isSaving,
          getWrappedOnSave,
          setRedirectOnSave,
          onCancel: handleCancel,
        }) => {
          const save = (draftSave = false) =>
            getWrappedOnSave(async () => {
              const researchOutput = await (draftSave
                ? onSaveDraft(currentPayload)
                : onSave(currentPayload));
              setRemotePayload(currentPayload);

              if (researchOutput) {
                const { id } = researchOutput;
                const baseUrl = sharedResearch({}).researchOutput({
                  researchOutputId: id,
                }).$;
                const savePath =
                  draftSave && !researchOutputData?.id
                    ? `${baseUrl}?draftCreated=true`
                    : baseUrl;

                const publishPath = sharedResearch({})
                  .researchOutput({
                    researchOutputId: id,
                  })
                  .researchOutputPublished({}).$;

                const redirectPath =
                  (!published || versionAction === 'create') && !draftSave
                    ? publishPath
                    : savePath;

                setRedirectOnSave(redirectPath);

                // Force navigation immediately to prevent React 18 batching from
                // letting useNavigationWarning cleanup interfere with the redirect.
                // See https://asaphub.atlassian.net/browse/ASAP-1319
                void navigate(redirectPath);
              }
              return researchOutput;
            })();

          const handleSaveDraft = async () => {
            setIsFormSubmitted(true);
            const nextModal = getDraftModal();
            if (nextModal) {
              setModal(nextModal);
            } else {
              await save(true);
            }
          };

          const handlePublish = async () => {
            setIsFormSubmitted(true);
            const nextModal = getPublishModal();
            if (nextModal) {
              setModal(nextModal);
            } else {
              await save(false);
            }
          };

          return (
            <>
              {modal && (
                <ResearchOutputConfirmModal
                  modal={modal}
                  onCancel={() => setModal(null)}
                  save={save}
                  setAlreadySeenModals={setAlreadySeenModals}
                />
              )}
              <div css={contentStyles} data-flow-id={flowId}>
                <ResearchOutputFormSharingCard
                  isFormSubmitted={isFormSubmitted}
                  isCreatingNewVersion={versionAction === 'create'}
                  displayChangelog={displayChangelog}
                  documentType={documentType}
                  serverValidationErrors={serverValidationErrors}
                  clearServerValidationError={clearServerValidationError}
                  isSaving={isSaving}
                  descriptionMD={descriptionMD}
                  onChangeDescription={setDescription}
                  shortDescription={shortDescription}
                  onChangeShortDescription={setShortDescription}
                  changelog={changelog}
                  onChangeChangelog={setChangelog}
                  impact={impact}
                  onChangeImpact={setImpact}
                  layImpactStatement={layImpactStatement}
                  onChangeLayImpactStatement={setLayImpactStatement}
                  categories={categories}
                  onChangeCategories={setCategories}
                  getImpactSuggestions={
                    getImpactSuggestions as (
                      searchQuery: string,
                    ) => Promise<{ label: string; value: string }[]>
                  }
                  getCategorySuggestions={getCategorySuggestions}
                  getShortDescriptionFromDescription={
                    getShortDescriptionFromDescription
                  }
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
                    setKeywords([]);
                  }}
                  subtype={subtype}
                  onChangeSubtype={setSubtype}
                  researchTags={filteredResearchTags}
                  typeOptions={typeOptions}
                  urlRequired={urlRequired}
                  typeDescription="Select the type that matches your output the best."
                />
                <ResearchOutputPublishingCard
                  documentType={documentType}
                  isCreatingOutputRoute={!!isCreatingOutput}
                  researchOutputData={researchOutputData}
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
                  isImportedFromManuscript={isImportedFromManuscript}
                />
                <ResearchOutputExtraInformationCard
                  documentType={documentType}
                  isSaving={isSaving}
                  researchTags={filteredResearchTags}
                  tagSuggestions={tagSuggestions.map((suggestion) => ({
                    label: suggestion,
                    value: suggestion,
                  }))}
                  tags={keywords}
                  onChangeTags={setKeywords}
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
                  isEditMode={!!researchOutputData}
                  authorsRequired={authorsRequired}
                />
                <ResearchOutputRelatedResearchCard<
                  EventResponse['relatedResearch']
                >
                  isSaving={isSaving}
                  relatedResearch={relatedResearch}
                  onChangeRelatedResearch={setRelatedResearch}
                  getRelatedResearchSuggestions={getRelatedResearchSuggestions}
                  getIconForDocumentType={getIconForDocumentType}
                  isEditMode={!!researchOutputData}
                />
                <ResearchOutputRelatedEventsCard
                  getRelatedEventSuggestions={getRelatedEventSuggestions}
                  isSaving={isSaving}
                  relatedEvents={relatedEvents}
                  onChangeRelatedEvents={setRelatedEvents}
                  isEditMode={!!researchOutputData}
                />
                <div css={formControlsContainerStyles}>
                  <div
                    css={
                      displayThreeButtons
                        ? formControlsThreeButtonsStyles
                        : formControlsTwoButtonsStyles
                    }
                  >
                    <Button
                      enabled={!isSaving}
                      fullWidth
                      onClick={handleCancel}
                      noMargin
                    >
                      Cancel
                    </Button>
                    {showSaveDraftButton && (
                      <Button
                        enabled={!isSaving}
                        fullWidth
                        onClick={handleSaveDraft}
                        primary={showSaveDraftButton && !showPublishButton}
                        noMargin
                      >
                        Save Draft
                      </Button>
                    )}
                    {showPublishButton && (
                      <Button
                        enabled={!isSaving}
                        fullWidth
                        primary
                        noMargin
                        onClick={handlePublish}
                      >
                        {published ? 'Save' : 'Publish'}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </>
          );
        }}
      </Form>
    </main>
  );
};

export default ResearchOutputForm;
