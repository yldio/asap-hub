import { ResearchOutputPostRequest } from '@asap-hub/model';
import { ComponentProps } from 'react';
import { Link } from '../atoms';

import { mailToSupport } from '../mail';
import { FormCard, LabeledMultiSelect, LabeledTextArea } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputExtraInformationProps = Pick<
  ResearchOutputPostRequest,
  'tags' | 'accessInstructions'
> & {
  tagSuggestions: NonNullable<
    ComponentProps<typeof LabeledMultiSelect>['suggestions']
  >;
  onChangeTags?: (values: string[]) => void;
  onChangeAccessInstructions?: (values: string) => void;
  isSaving: boolean;
};

const TeamCreateOutputExtraInformationCard: React.FC<TeamCreateOutputExtraInformationProps> =
  ({
    onChangeTags = noop,
    tags,
    tagSuggestions,
    onChangeAccessInstructions = noop,
    accessInstructions,
    isSaving,
  }) => (
    <FormCard title="What extra information can you provide?">
      <LabeledMultiSelect
        title="Additional Keywords"
        description="Increase the discoverability of this output by adding tags."
        subtitle="(optional)"
        values={tags.map((tag) => ({ label: tag, value: tag }))}
        enabled={!isSaving}
        suggestions={tagSuggestions}
        placeholder="Add a keyword (E.g. Cell Biology)"
        onChange={(options) => onChangeTags(options.map(({ value }) => value))}
      />

      <Link href={mailToSupport({ subject: 'New keyword' }).toString()}>
        Ask ASAP to add a new keyword
      </Link>

      <LabeledTextArea
        title="Access instructions"
        subtitle="(optional)"
        onChange={onChangeAccessInstructions}
        placeholder="E.g. To access the output, you will first need to create an account on..."
        enabled={!isSaving}
        value={accessInstructions || ''}
      />
    </FormCard>
  );

export default TeamCreateOutputExtraInformationCard;
