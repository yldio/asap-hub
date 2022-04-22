import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import {
  DecisionOption,
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputDocumentType,
  TeamResponse,
  ResearchOutputIdentifierType,
} from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';

import {
  TeamCreateOutputFormSharingCard,
  TeamCreateOutputExtraInformationCard,
  Form,
} from './index';
import { Button } from '../atoms';
import { perRem, mobileScreen } from '../pixels';
import { noop } from '../utils';

import TeamCreateOutputContributorsCard from './TeamCreateOutputContributorsCard';

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

type TeamCreateOutputFormProps = Pick<
  ComponentProps<typeof TeamCreateOutputExtraInformationCard>,
  'tagSuggestions'
> &
  Pick<
    ComponentProps<typeof TeamCreateOutputFormSharingCard>,
    'serverValidationErrors' | 'clearServerValidationError'
  > &
  Pick<
    ComponentProps<typeof TeamCreateOutputContributorsCard>,
    'getLabSuggestions' | 'getAuthorSuggestions' | 'getTeamSuggestions'
  > & {
    onSave: (
      output: ResearchOutputPostRequest,
    ) => Promise<Pick<ResearchOutputResponse, 'id'> | void>;
    documentType: ResearchOutputDocumentType;
    team: TeamResponse;
  };

const identifierTypeToFieldName: Record<
  ResearchOutputIdentifierType,
  'doi' | 'accession' | 'labCatalogNumber' | 'rrid' | undefined
> = {
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

const TeamCreateOutputForm: React.FC<TeamCreateOutputFormProps> = ({
  onSave = noop,
  tagSuggestions,
  documentType,
  getLabSuggestions = noop,
  getTeamSuggestions = noop,
  getAuthorSuggestions = noop,
  team,
  serverValidationErrors,
  clearServerValidationError,
}) => {
  const [tags, setTags] = useState<ResearchOutputPostRequest['tags']>([]);
  const [type, setType] = useState<ResearchOutputPostRequest['type'] | ''>('');
  const [title, setTitle] = useState<ResearchOutputPostRequest['title']>('');
  const [labCatalogNumber, setLabCatalogNumber] =
    useState<ResearchOutputPostRequest['labCatalogNumber']>('');
  const [labs, setLabs] = useState<
    NonNullable<ComponentProps<typeof TeamCreateOutputContributorsCard>['labs']>
  >([]);
  const [authors, setAuthors] = useState<
    NonNullable<
      ComponentProps<typeof TeamCreateOutputContributorsCard>['authors']
    >
  >([]);

  const [teams, setTeams] = useState<
    NonNullable<
      ComponentProps<typeof TeamCreateOutputContributorsCard>['teams']
    >
  >([{ label: team.displayName, value: team.id, isFixed: true }]);
  const [description, setDescription] =
    useState<ResearchOutputPostRequest['description']>('');
  const [link, setLink] = useState<ResearchOutputPostRequest['link']>('');
  const [accessInstructions, setAccessInstructions] =
    useState<ResearchOutputPostRequest['accessInstructions']>('');
  const [asapFunded, setAsapFunded] = useState<DecisionOption>('Not Sure');
  const [usedInPublication, setUsedInPublication] =
    useState<DecisionOption>('Not Sure');

  const [sharingStatus, setSharingStatus] =
    useState<ResearchOutputPostRequest['sharingStatus']>('Network Only');
  const [publishDate, setPublishDate] = useState<Date | undefined>(undefined);

  const [identifierType, setIdentifierType] =
    useState<ResearchOutputIdentifierType>(ResearchOutputIdentifierType.None);
  const [identifier, setIdentifier] = useState<string>('');

  return (
    <Form
      serverErrors={serverValidationErrors}
      dirty={
        tags.length !== 0 ||
        title !== '' ||
        description !== '' ||
        link !== '' ||
        type !== '' ||
        labs.length !== 0 ||
        authors.length !== 0 ||
        identifierType !== ResearchOutputIdentifierType.None ||
        identifier !== '' ||
        labCatalogNumber !== '' ||
        teams.length !== 1 // Original team
      }
      onSave={() => {
        const convertDecisionToBoolean = (decision: DecisionOption): boolean =>
          decision === 'Yes';

        const identifierField = createIdentifierField(
          identifierType,
          identifier,
        );

        /* istanbul ignore next */
        if (!type) {
          throw new Error('There is no type provided.');
        }

        return onSave({
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
          ...identifierField,
        });
      }}
    >
      {({ isSaving, onSave: handleSave, onCancel: handleCancel }) => (
        <div css={contentStyles}>
          <TeamCreateOutputFormSharingCard
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
            onChangeType={setType}
            asapFunded={asapFunded}
            onChangeAsapFunded={setAsapFunded}
            usedInPublication={usedInPublication}
            onChangeUsedInPublication={setUsedInPublication}
            sharingStatus={sharingStatus}
            onChangeSharingStatus={setSharingStatus}
            publishDate={publishDate}
            onChangePublishDate={(date) => setPublishDate(new Date(date))}
          />
          <TeamCreateOutputExtraInformationCard
            documentType={documentType}
            isSaving={isSaving}
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
          />
          <TeamCreateOutputContributorsCard
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
              <Button enabled={!isSaving} primary onClick={handleSave}>
                Share
              </Button>
            </div>
          </div>
        </div>
      )}
    </Form>
  );
};
export default TeamCreateOutputForm;
