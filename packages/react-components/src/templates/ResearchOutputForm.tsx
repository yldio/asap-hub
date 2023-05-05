import { css } from '@emotion/react';
import { isEnabled } from '@asap-hub/flags';
import {
  DecisionOption,
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchTagResponse,
} from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import React, { ComponentProps, useState } from 'react';
import equal from 'fast-deep-equal';
import { contentSidePaddingWithNavigation } from '../layout';
import {
  Form,
  ResearchOutputExtraInformationCard,
  ResearchOutputFormSharingCard,
} from '../organisms';
import { mobileScreen, perRem } from '../pixels';
import { Button } from '../atoms';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';
import ResearchOutputRelatedResearchCard from '../organisms/ResearchOutputRelatedResearchCard';

import {
  noop,
  getDecision,
  getPublishDate,
  getIdentifierType,
  getPayload,
} from '../utils';

type ResearchOutputFormProps = Pick<
  ComponentProps<typeof ResearchOutputFormSharingCard>,
  | 'serverValidationErrors'
  | 'clearServerValidationError'
  | 'typeOptions'
  | 'urlRequired'
> &
  Pick<
    ComponentProps<typeof ResearchOutputContributorsCard>,
    | 'getLabSuggestions'
    | 'getAuthorSuggestions'
    | 'getTeamSuggestions'
    | 'authorsRequired'
  > & {
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
    researchOutputData?: ResearchOutputResponse;
    tagSuggestions: string[];
    permissions: {
      canEditResearchOutput: boolean;
      canPublishResearchOutput: boolean;
      canShareResearchOutput: boolean;
    };
  };

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
  getRelatedResearchSuggestions = noop,
  researchTags,
  serverValidationErrors,
  clearServerValidationError,
  published,
  permissions,
}) => {
  const { canShareResearchOutput, canPublishResearchOutput } = permissions;

  const showSaveDraftButton =
    isEnabled('DRAFT_RESEARCH_OUTPUT') && !published && canShareResearchOutput;
  const showPublishButton = canPublishResearchOutput;
  const displayThreeButtons = showSaveDraftButton && showPublishButton;

  const [type, setType] = useState<ResearchOutputPostRequest['type'] | ''>(
    researchOutputData?.type || undefined,
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
  >(
    researchOutputData?.relatedResearch?.map((research) => ({
      value: research.id,
      label: research.title,
      type: research.type,
      documentType: research.documentType,
    })) || [],
  );

  const [descriptionMD, setDescription] = useState<
    ResearchOutputPostRequest['descriptionMD']
  >(researchOutputData?.descriptionMD || '');
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
    description: '',
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
    published,
  });

  const [remotePayload, setRemotePayload] = useState(currentPayload);

  return (
    <main css={mainStyles}>
      <Form<ResearchOutputResponse>
        serverErrors={serverValidationErrors}
        dirty={!equal(remotePayload, currentPayload)}
      >
        {({
          isSaving,
          getWrappedOnSave,
          setRedirectOnSave,
          onCancel: handleCancel,
        }) => (
          <div css={contentStyles}>
            <ResearchOutputFormSharingCard
              serverValidationErrors={serverValidationErrors}
              clearServerValidationError={clearServerValidationError}
              isSaving={isSaving}
              descriptionMD={descriptionMD}
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
            <ResearchOutputRelatedResearchCard
              isSaving={isSaving}
              relatedResearch={relatedResearch}
              onChangeRelatedResearch={setRelatedResearch}
              getRelatedResearchSuggestions={getRelatedResearchSuggestions}
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
                <Button enabled={!isSaving} fullWidth onClick={handleCancel}>
                  Cancel
                </Button>
                {showSaveDraftButton && (
                  <Button
                    enabled={!isSaving}
                    fullWidth
                    onClick={getWrappedOnSave(async () => {
                      const researchOutput = await onSaveDraft(currentPayload);
                      setRemotePayload(currentPayload);
                      if (researchOutput) {
                        const { id } = researchOutput;
                        setRedirectOnSave(
                          sharedResearch({}).researchOutput({
                            researchOutputId: id,
                          }).$,
                        );
                      }
                      return researchOutput;
                    })}
                    primary={showSaveDraftButton && !showPublishButton}
                  >
                    Save Draft
                  </Button>
                )}
                {showPublishButton && (
                  <Button
                    enabled={!isSaving}
                    fullWidth
                    primary
                    onClick={getWrappedOnSave(async () => {
                      const researchOutput = await onSave(currentPayload);
                      setRemotePayload(currentPayload);
                      if (researchOutput) {
                        const { id } = researchOutput;
                        const savePath = sharedResearch({}).researchOutput({
                          researchOutputId: id,
                        }).$;
                        const publishPath = sharedResearch({})
                          .researchOutput({
                            researchOutputId: id,
                          })
                          .researchOutputPublished({}).$;
                        setRedirectOnSave(published ? savePath : publishPath);
                      }
                      return researchOutput;
                    })}
                  >
                    {published ? 'Save' : 'Publish'}
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Form>
    </main>
  );
};

export default ResearchOutputForm;
