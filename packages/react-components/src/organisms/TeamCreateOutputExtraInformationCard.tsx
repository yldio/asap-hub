import { ResearchOutputPostRequest } from '@asap-hub/model';
import { ComponentProps } from 'react';
import { Link } from '../atoms';

import { mailToSupport } from '../mail';
import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type TeamCreateOutputExtraInformationProps = Pick<
  ResearchOutputPostRequest,
  'tags'
> & {
  tagSuggestions: NonNullable<
    ComponentProps<typeof LabeledMultiSelect>['suggestions']
  >;
  onChange?: (values: string[]) => void;
  isSaving: boolean;
};

const TeamCreateOutputExtraInformationCard: React.FC<TeamCreateOutputExtraInformationProps> =
  ({ onChange = noop, tags, tagSuggestions, isSaving }) => (
    <FormCard title="What extra information can you provide?">
      <LabeledMultiSelect
        title="Additional Keywords"
        description="Increase the discoverability of this output by adding tags."
        subtitle="(optional)"
        values={tags.map((tag) => ({ label: tag, value: tag }))}
        enabled={!isSaving}
        suggestions={tagSuggestions}
        placeholder="Add a keyword (E.g. Cell Biology)"
        onChange={(options) => onChange(options.map(({ value }) => value))}
      />

      <Link href={mailToSupport({ subject: 'New keyword' }).toString()}>
        Ask ASAP to add a new keyword
      </Link>
    </FormCard>
  );

export default TeamCreateOutputExtraInformationCard;
