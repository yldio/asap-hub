import { Lab } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentProps, useState } from 'react';
import {
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputType,
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
import { OptionValue } from '../atoms/AsyncMultiSelect';

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
});

type TeamCreateOutputFormProps = Pick<
  ComponentProps<typeof TeamCreateOutputExtraInformationCard>,
  'tagSuggestions'
> & {
  getLabSuggestions: ComponentProps<
    typeof TeamCreateOutputContributorsCard
  >['loadOptions'];
  onSave?: (
    output: Partial<ResearchOutputPostRequest>,
  ) => Promise<Pick<ResearchOutputResponse, 'id'>>;
  type: ResearchOutputType;
};

const TeamCreateOutputForm: React.FC<TeamCreateOutputFormProps> = ({
  onSave = noop,
  tagSuggestions,
  type,
  getLabSuggestions,
}) => {
  const [tags, setTags] = useState<ResearchOutputPostRequest['tags']>([]);
  const [subTypes, setSubtypes] = useState<
    ResearchOutputPostRequest['subTypes']
  >([]);
  const [title, setTitle] = useState<ResearchOutputPostRequest['title']>('');
  const [labs, setLabs] = useState<OptionValue[]>([]);
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
        subTypes.length !== 0
      }
      onSave={() =>
        onSave({
          tags,
          link,
          description,
          title,
          subTypes,
          labs: labs.map(
            ({ value, label }: OptionValue): Lab => ({
              name: label,
              id: value,
            }),
          ),
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
            loadOptions={getLabSuggestions}
            values={labs}
            onChange={setLabs}
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
