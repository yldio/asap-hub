import { css } from '@emotion/react';
import { ComponentProps, useCallback, useState } from 'react';
import {
  ResearchOutputPostRequest,
  ResearchOutputResponse,
  ResearchOutputType,
} from '@asap-hub/model';

import {
  TeamCreateOutputFormSharingCard,
  TeamCreateOutputExtraInformationCard,
  Form,
} from '.';
import { Button } from '../atoms';
import { perRem } from '../pixels';
import { noop } from '../utils';

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
  onSave?: (
    output: Partial<ResearchOutputPostRequest>,
  ) => Promise<Pick<ResearchOutputResponse, 'id'>>;
  type: ResearchOutputType;
};

const TeamCreateOutputForm: React.FC<TeamCreateOutputFormProps> = ({
  onSave = noop,
  tagSuggestions,
  type,
}) => {
  const [tags, setTags] = useState<ResearchOutputPostRequest['tags']>([]);
  const [subTypes, setSubtypes] = useState<
    ResearchOutputPostRequest['subTypes']
  >(['Preprint']);
  const [title, setTitle] = useState<ResearchOutputPostRequest['title']>('');
  const [description, setDescription] =
    useState<ResearchOutputPostRequest['description']>('');
  const [link, setLink] = useState<ResearchOutputPostRequest['link']>('');
  const onSaveCallback = useCallback(async () => {
    await onSave({ tags, link, description, title, subTypes });
  }, [onSave, tags, link, description, title, subTypes]);

  return (
    <Form
      dirty={
        tags.length !== 0 ||
        title !== '' ||
        description !== '' ||
        link !== '' ||
        subTypes.length !== 0
      }
      onSave={onSaveCallback}
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
