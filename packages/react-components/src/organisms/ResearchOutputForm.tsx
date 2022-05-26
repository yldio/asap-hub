import {
  convertDecisionToBoolean,
  DecisionOption,
  ResearchOutputDocumentType,
  ResearchOutputIdentifierType,
  ResearchOutputPostRequest,
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
import { getIdentifierType, noop, isDirty } from '../utils';
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
      output: ResearchOutputPostRequest,
    ) => Promise<ResearchOutputResponse | void>;
    researchTags: ResearchTagResponse[];
    documentType: ResearchOutputDocumentType;
    team: TeamResponse;
    researchOutputData?: ResearchOutputResponse;
  };

const identifierTypeToFieldName: Record<
  ResearchOutputIdentifierType,
  'doi' | 'accession' | 'labCatalogNumber' | 'rrid' | undefined
> = {
  [ResearchOutputIdentifierType.Empty]: undefined,
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
}) => {
  const historyPush = usePushFromHere();
  const [tags, setTags] = useState<ResearchOutputPostRequest['tags']>(
    researchOutputData?.tags.map((tag) => tag) || [],
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
      isFixed: index === 0,
    })) || [{ label: team.displayName, value: team.id, isFixed: true }],
  );

  const [description, setDescription] = useState<
    ResearchOutputPostRequest['description']
  >(researchOutputData?.description || '');
  const [link, setLink] = useState<ResearchOutputPostRequest['link']>(
    researchOutputData?.link || '',
  );
  const [accessInstructions, setAccessInstructions] = useState<
    ResearchOutputPostRequest['accessInstructions']
  >(researchOutputData?.accessInstructions || '');
  const [asapFunded, setAsapFunded] = useState<DecisionOption>(
    researchOutputData?.asapFunded ? 'Yes' : 'No' || 'Not Sure',
  );
  const [usedInPublication, setUsedInPublication] = useState<DecisionOption>(
    researchOutputData?.usedInPublication ? 'Yes' : 'No' || 'Not Sure',
  );

  const [sharingStatus, setSharingStatus] = useState<
    ResearchOutputPostRequest['sharingStatus']
  >(researchOutputData?.sharingStatus || 'Network Only');

  const [publishDate, setPublishDate] = useState<Date | undefined>(
    (researchOutputData?.publishDate &&
      new Date(researchOutputData?.publishDate)) ||
      undefined,
  );

  const [identifierType, setIdentifierType] =
    useState<ResearchOutputIdentifierType>(
      (researchOutputData && getIdentifierType(researchOutputData)) ||
        ResearchOutputIdentifierType.Empty,
    );

  const [identifier, setIdentifier] = useState<string>(
    researchOutputData?.doi ||
      researchOutputData?.rrid ||
      researchOutputData?.accession ||
      '',
  );

  const [methods, setMethods] = useState<string[]>(
    researchOutputData?.methods.map((method) => method) || [],
  );
  const [organisms, setOrganisms] = useState<string[]>(
    researchOutputData?.organisms.map((organism) => organism) || [],
  );
  const [environments, setEnvironments] = useState<string[]>(
    researchOutputData?.environments.map((environment) => environment) || [],
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
          methods,
          organisms,
          environments,
          teams,
          labs: labs.map(({ value, label }) => ({ id: value, name: label })),
          authors,
          subtype,
          labCatalogNumber,
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
          accessInstructions:
            String(accessInstructions).trim() !== ''
              ? accessInstructions
              : undefined,
          asapFunded: convertDecisionToBoolean(asapFunded),
          usedInPublication: convertDecisionToBoolean(usedInPublication),
          sharingStatus,
          publishDate: publishDate?.toISOString(),
          labCatalogNumber:
            documentType === 'Lab Resource' && labCatalogNumber !== ''
              ? labCatalogNumber
              : undefined,
          addedDate: new Date().toISOString(),
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
            onChangePublishDate={(date) => setPublishDate(new Date(date))}
          />
          <ResearchOutputExtraInformationCard
            documentType={documentType}
            isSaving={isSaving}
            researchTags={filteredResearchTags}
            tagSuggestions={tagSuggestions}
            tags={tags}
            onChangeTags={setTags}
            accessInstructions={accessInstructions}
            onChangeAccessInstructions={setAccessInstructions}
            identifier={identifier}
            setIdentifier={setIdentifier}
            identifierType={identifierType}
            setIdentifierType={setIdentifierType}
            identifierRequired={
              usedInPublication === 'Yes' && asapFunded === 'Yes'
            }
            labCatalogNumber={labCatalogNumber}
            onChangeLabCatalogNumber={setLabCatalogNumber}
            methods={methods}
            onChangeMethods={setMethods}
            organisms={organisms}
            onChangeOrganisms={setOrganisms}
            environments={environments}
            onChangeEnvironments={setEnvironments}
            type={type}
            isEditMode={researchOutputData !== undefined}
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
                {researchOutputData ? 'Save' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
};
export default ResearchOutputForm;
