import {
  DecisionOption,
  EventResponse,
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { OptionsType } from 'react-select';

import { ResearchOutputPermissions } from '@asap-hub/react-context';
import { network, sharedResearch } from '@asap-hub/routing';
import equal from 'fast-deep-equal';
import React, { ComponentProps, useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';

import { Button, Link, MultiSelectOptionsType } from '../atoms';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { mailToSupport, TECH_SUPPORT_EMAIL } from '../mail';
import {
  ConfirmModal,
  Form,
  ResearchOutputExtraInformationCard,
  ResearchOutputFormSharingCard,
  ResearchOutputRelatedEventsCard,
} from '../organisms';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';
import ResearchOutputRelatedResearchCard from '../organisms/ResearchOutputRelatedResearchCard';
import { mobileScreen, perRem, rem } from '../pixels';

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
    descriptionUnchangedWarning?: boolean;
    isImportedFromManuscript?: boolean;
  };

const mainStyles = css({
  padding: defaultPageLayoutPaddingStyle,
});

const contentStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  maxWidth: `${800 / perRem}em`,
  justifyContent: 'center',
  gridAutoFlow: 'row',
  rowGap: rem(32),
});

const formControlsContainerStyles = css({
  display: 'flex',
  justifyContent: 'end',
  paddingBottom: `${200 / perRem}em`, // Hack for labs selector
  [`@media (max-width: 810px)`]: {
    justifySelf: 'end',
    width: '100%',
  },
});

const formControlsTwoButtonsStyles = css({
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

const formControlsThreeButtonsStyles = css({
  display: 'grid',
  alignItems: 'end',
  gap: `${24 / perRem}em`,
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
  descriptionUnchangedWarning = false,
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
}) => {
  const { canShareResearchOutput, canPublishResearchOutput } = permissions;

  const showSaveDraftButton =
    !isImportedFromManuscript && !published && canShareResearchOutput;
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

  const [changelog, setChangelog] = useState<
    ResearchOutputPostRequest['changelog']
  >(versionAction === 'create' ? '' : researchOutputData?.changelog || '');
  const [
    dismissedDescriptionChangePrompt,
    setDismissedDescriptionChangePrompt,
  ] = useState(false);

  const promptDescriptionChange =
    descriptionMD === researchOutputData?.descriptionMD &&
    descriptionUnchangedWarning &&
    !dismissedDescriptionChangePrompt;
  const [showDescriptionChangePrompt, setShowDescriptionChangePrompt] =
    useState<false | 'draft' | 'publish'>(false);

  const [dismissedVersionPrompt, setDismissedVersionPrompt] = useState(false);
  const [showVersionPrompt, setShowVersionPrompt] = useState(false);
  const promptNewVersion =
    versionAction === 'create' && !dismissedVersionPrompt;

  const [showConfirmPublish, setShowConfirmPublish] = useState<boolean>(false);

  const [link, setLink] = useState<ResearchOutputPostRequest['link']>(
    researchOutputData?.link || '',
  );
  const [usageNotes, setUsageNotes] = useState<
    ResearchOutputPostRequest['usageNotes']
  >(researchOutputData?.usageNotesMD || researchOutputData?.usageNotes || '');
  const [asapFunded, setAsapFunded] = useState<DecisionOption>(
    getDecision(researchOutputData?.asapFunded),
  );

  const isCreatingTeamArticle = useRouteMatch(
    network({})
      .teams({})
      .team({
        teamId: (teams as OptionsType<MultiSelectOptionsType>)[0]?.value || '',
      })
      .createOutput({
        outputDocumentType: 'article',
      }).$,
  );

  const isCreatingWorkingGroupArticle = useRouteMatch(
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
                const savePath = sharedResearch({}).researchOutput({
                  researchOutputId: id,
                  draftCreated: draftSave && !researchOutputData?.id,
                }).$;
                const publishPath = sharedResearch({})
                  .researchOutput({
                    researchOutputId: id,
                  })
                  .researchOutputPublished({}).$;
                setRedirectOnSave(
                  (!published || versionAction === 'create') && !draftSave
                    ? publishPath
                    : savePath,
                );
              }
              return researchOutput;
            })();
          const confirmDescriptionText = `Keep and ${
            showDescriptionChangePrompt === 'draft' ? 'save' : 'publish'
          }`;
          return (
            <>
              {showVersionPrompt && (
                <ConfirmModal
                  title="Publish new version for the whole hub?"
                  cancelText="Cancel"
                  onCancel={() => setShowVersionPrompt(false)}
                  confirmText="Publish new version"
                  onSave={async () => {
                    setDismissedVersionPrompt(true);
                    const result = await save(false);
                    if (!result) {
                      setShowVersionPrompt(false);
                    }
                  }}
                  description={
                    <>
                      Once published this output version will be available to
                      all Hub members and reminders will be issued to all
                      associated contributors. If you have any issues with this
                      output version after it has been published, please contact{' '}
                      {<Link href={mailToSupport()}>{TECH_SUPPORT_EMAIL}</Link>}
                      .
                    </>
                  }
                />
              )}

              {showDescriptionChangePrompt && (
                <ConfirmModal
                  title="Keep the same description?"
                  cancelText="Cancel"
                  onCancel={() => setShowDescriptionChangePrompt(false)}
                  confirmText={confirmDescriptionText}
                  onSave={async () => {
                    setDismissedDescriptionChangePrompt(true);
                    const result = await save(
                      showDescriptionChangePrompt === 'draft',
                    );
                    if (!result) {
                      setShowDescriptionChangePrompt(false);
                    }
                  }}
                  description="We noticed that you kept the same description as your previous output. ASAP encourages users to provide specific context for each output."
                />
              )}
              {showConfirmPublish && (
                <ConfirmModal
                  title="Publish output for the whole hub?"
                  cancelText="Cancel"
                  onCancel={() => setShowConfirmPublish(false)}
                  confirmText="Publish Output"
                  onSave={async () => {
                    await save(false);
                    setShowConfirmPublish(false);
                  }}
                  description={
                    <>
                      Once published this output will be available to all Hub
                      members and reminders will be issued to all associated
                      contributors. If you have any issues with the output after
                      it has been published, please contact{' '}
                      <Link href={mailToSupport()}>{TECH_SUPPORT_EMAIL}</Link>.
                    </>
                  }
                />
              )}
              <div css={contentStyles}>
                <ResearchOutputFormSharingCard
                  isFormSubmitted={isFormSubmitted}
                  isCreatingNewVersion={versionAction === 'create'}
                  displayChangelog={displayChangelog}
                  documentType={documentType}
                  isCreatingOutputRoute={!!isCreatingOutput}
                  researchOutputData={researchOutputData}
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
                  typeOptions={typeOptions}
                  urlRequired={urlRequired}
                  typeDescription="Select the type that matches your output the best."
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
                        onClick={async () => {
                          setIsFormSubmitted(true);
                          promptDescriptionChange
                            ? setShowDescriptionChangePrompt('draft')
                            : await save(true);
                        }}
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
                        onClick={async () => {
                          setIsFormSubmitted(true);

                          promptDescriptionChange
                            ? setShowDescriptionChangePrompt('publish')
                            : promptNewVersion
                              ? setShowVersionPrompt(true)
                              : !published
                                ? setShowConfirmPublish(true)
                                : await save(false);
                        }}
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
