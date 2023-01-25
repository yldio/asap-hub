import { css } from '@emotion/react';
import {
  DecisionOption,
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
  ResearchOutputHeader,
} from '../organisms';
import { mobileScreen, perRem } from '../pixels';
import { Button } from '../atoms';
import ResearchOutputContributorsCard from '../organisms/ResearchOutputContributorsCard';
import { usePushFromHere } from '../routing';
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
  | 'descriptionTip'
  | 'typeOptions'
  | 'typeDescription'
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
      output: Omit<ResearchOutputPostRequest, 'publishingEntity'>,
    ) => Promise<ResearchOutputResponse | void>;
    researchTags: ResearchTagResponse[];
    selectedTeams: NonNullable<
      ComponentProps<typeof ResearchOutputContributorsCard>['teams']
    >;
    researchOutputData?: ResearchOutputResponse;
    isEditMode: boolean;
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

const ResearchOutputForm: React.FC<ResearchOutputFormProps> = ({
  documentType,
  researchOutputData,
  isEditMode,
  onSave,
  tagSuggestions,
  typeDescription,
  descriptionTip,
  urlRequired = true,
  authorsRequired = false,
  typeOptions,
  selectedTeams = [],
  getLabSuggestions = noop,
  getTeamSuggestions = noop,
  getAuthorSuggestions = noop,
  researchTags,
  serverValidationErrors,
  clearServerValidationError,
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

  const [teams, setTeams] =
    useState<
      NonNullable<
        ComponentProps<typeof ResearchOutputContributorsCard>['teams']
      >
    >(selectedTeams);

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

  const currentPayload = getPayload({
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
  });

  const [remotePayload] = useState(currentPayload);

  return (
    <main css={mainStyles}>
      <Form<ResearchOutputResponse>
        serverErrors={serverValidationErrors}
        dirty={!equal(remotePayload, currentPayload)}
        onSave={() => onSave(currentPayload)}
      >
        {({ isSaving, onSave: handleSave, onCancel: handleCancel }) => (
          <div css={contentStyles}>
            <ResearchOutputFormSharingCard
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
              typeOptions={typeOptions}
              urlRequired={urlRequired}
              typeDescription={typeDescription}
              descriptionTip={descriptionTip}
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
              authorsRequired={authorsRequired}
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
  );
};

export default ResearchOutputForm;
