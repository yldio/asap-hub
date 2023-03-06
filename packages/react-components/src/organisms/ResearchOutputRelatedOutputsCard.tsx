import { ComponentPropsWithRef } from 'react';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop } from '../utils';

type ResearchOutputRelatedOutputsProps = {
  readonly relatedResearch: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['values'];
  readonly getRelatedResearchSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['loadOptions'];
  readonly onChangeRelatedResearch?: ComponentPropsWithRef<
    typeof LabeledMultiSelect
  >['onChange'];

  readonly isSaving: boolean;
  isEditMode?: boolean;
};

const ResearchOutputContributorsCard: React.FC<
  ResearchOutputRelatedOutputsProps
> = ({
  relatedResearch,
  getRelatedResearchSuggestions = noop,
  onChangeRelatedResearch = noop,
  isSaving,
  isEditMode,
}) => (
  <FormCard title="Are there any related outputs?">
    <LabeledMultiSelect
      title="Related Outputs"
      description="List all resources that were important to the creation of this output. Only published outputs on the CRN Hub will be available below."
      subtitle="(optional)"
      enabled={!isSaving || !isEditMode}
      placeholder="Start typing..."
      loadOptions={getRelatedResearchSuggestions}
      onChange={onChangeRelatedResearch}
      values={relatedResearch}
      noOptionsMessage={({ inputValue }) =>
        `Sorry, no related outputs match ${inputValue}`
      }
    />
  </FormCard>
);
export default ResearchOutputContributorsCard;
