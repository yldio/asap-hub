import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import {
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputType,
  TeamResponse,
} from '@asap-hub/model';

import {
  TeamCreateOutputFormSharingCard,
  TeamCreateOutputExtraInformationCard,
  Form,
} from './index';
import { Button } from '../atoms';
import { perRem } from '../pixels';
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

type TeamCreateOutputFormProps = Pick<
  ComponentProps<typeof TeamCreateOutputExtraInformationCard>,
  'tagSuggestions'
> & {
  getLabSuggestions?: ComponentProps<
    typeof TeamCreateOutputContributorsCard
  >['getLabSuggestions'];
  getAuthorSuggestions?: ComponentProps<
    typeof TeamCreateOutputContributorsCard
  >['getAuthorSuggestions'];
  getTeamSuggestions?: ComponentProps<
    typeof TeamCreateOutputContributorsCard
  >['getTeamSuggestions'];
  onSave?: (
    output: Partial<ResearchOutputPostRequest>,
  ) => Promise<Pick<ResearchOutputResponse, 'id'>>;
  type: ResearchOutputType;
  team: TeamResponse;
};

const TeamCreateOutputForm: React.FC<TeamCreateOutputFormProps> = ({
  onSave = noop,
  tagSuggestions,
  type,
  getLabSuggestions = noop,
  getTeamSuggestions = noop,
  getAuthorSuggestions = noop,
  team,
}) => {
  const [tags, setTags] = useState<ResearchOutputPostRequest['tags']>([]);
  const [subTypes, setSubtypes] = useState<
    ResearchOutputPostRequest['subTypes']
  >([]);
  const [title, setTitle] = useState<ResearchOutputPostRequest['title']>('');
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

  return (
    <Form
      dirty={
        tags.length !== 0 ||
        title !== '' ||
        description !== '' ||
        link !== '' ||
        subTypes.length !== 0 ||
        labs.length !== 0 ||
        authors.length !== 0 ||
        teams.length !== 1 // Original team
      }
      onSave={() =>
        onSave({
          tags,
          link,
          description,
          title,
          subTypes,
          authors: authors.map(({ value }) => value),
          labs: labs.map(({ value }) => value),
          teams: teams.map(({ value }) => value),
        })
      }
    >
      {({ isSaving, onSave: onClick }) => (
        <div css={contentStyles}>
          <TeamCreateOutputFormSharingCard
            type={type}
            isSaving={isSaving}
            description={description}
            onChangeDescription={setDescription}
            title={title}
            onChangeTitle={setTitle}
            link={link}
            onChangeLink={setLink}
            subTypes={subTypes}
            onChangeSubtypes={setSubtypes}
          />
          <TeamCreateOutputExtraInformationCard
            isSaving={isSaving}
            tagSuggestions={tagSuggestions}
            tags={tags}
            onChange={setTags}
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
            <div style={{ display: 'block' }}>
              <Button enabled={!isSaving} primary onClick={onClick}>
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
