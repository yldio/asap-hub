import { USER_SOCIAL_WEBSITE } from '@asap-hub/validation';
import {
  ResearchOutputPostRequest,
  ResearchOutputSubtype,
  researchOutputTypeToSubtype,
} from '@asap-hub/model';

import { globeIcon } from '../icons';
import {
  LabeledTextArea,
  LabeledTextField,
  FormCard,
  LabeledDropdown,
} from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputFormSharingCardProps = Pick<
  ResearchOutputPostRequest,
  'link' | 'title' | 'description' | 'subTypes' | 'type'
> & {
  onChangeLink?: (newValue: string) => void;
  onChangeTitle?: (newValue: string) => void;
  onChangeDescription?: (newValue: string) => void;
  onChangeSubtypes?: (newValue: ResearchOutputSubtype[]) => void;
  isSaving: boolean;
};

const TeamCreateOutputFormSharingCard: React.FC<TeamCreateOutputFormSharingCardProps> =
  ({
    isSaving,
    link,
    title,
    description,
    type,
    subTypes,
    onChangeDescription = noop,
    onChangeLink = noop,
    onChangeTitle = noop,
    onChangeSubtypes = noop,
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
      <LabeledDropdown<ResearchOutputSubtype>
        title="Type"
        subtitle="(required)"
        options={[...researchOutputTypeToSubtype[type].values()].map(
          (option) => ({
            value: option,
            label: option,
          }),
        )}
        onChange={(subType) => onChangeSubtypes([subType])}
        getValidationMessage={() => 'Please choose a type'}
        value={subTypes[0] ?? ''}
        enabled={!isSaving}
        required
        noOptionsMessage={(option) =>
          `Sorry, no types match ${option.inputValue}`
        }
        placeholder="Choose a type"
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
