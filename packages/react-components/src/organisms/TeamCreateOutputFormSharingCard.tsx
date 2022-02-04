import { USER_SOCIAL_WEBSITE } from '@asap-hub/validation';
import { ResearchOutputPostRequest } from '@asap-hub/model';

import { globeIcon } from '../icons';
import { LabeledTextArea, LabeledTextField, FormCard } from '../molecules';

type TeamCreateOutputFormSharingCardProps = Pick<
  ResearchOutputPostRequest,
  'link' | 'title' | 'description'
> & {
  onChangeLink: (newValue: string) => void;
  onChangeTitle: (newValue: string) => void;
  onChangeDescription: (newValue: string) => void;
  isSaving: boolean;
};

const TeamCreateOutputFormSharingCard: React.FC<TeamCreateOutputFormSharingCardProps> =
  ({
    isSaving,
    link,
    title,
    description,
    onChangeDescription,
    onChangeLink,
    onChangeTitle,
  }) => (
    <FormCard title="What are you sharing?">
      <LabeledTextField
        title="URL"
        subtitle="(required)"
        pattern={USER_SOCIAL_WEBSITE.source}
        onChange={onChangeLink}
        getValidationMessage={() =>
          'Please enter a valid URL, starting with http://'
        }
        value={link ?? ''}
        enabled={!isSaving}
        required
        labelIndicator={globeIcon}
        placeholder="https://example.com"
      />
      <LabeledTextField
        title="Title"
        maxLength={350}
        subtitle="(required)"
        onChange={onChangeTitle}
        getValidationMessage={() => 'Please enter a title'}
        value={title}
        required
        enabled={!isSaving}
      />
      <LabeledTextArea
        title="Description"
        subtitle="(required)"
        onChange={onChangeDescription}
        getValidationMessage={() => 'Please enter a description'}
        required
        enabled={!isSaving}
        value={description}
      />
    </FormCard>
  );

export default TeamCreateOutputFormSharingCard;
