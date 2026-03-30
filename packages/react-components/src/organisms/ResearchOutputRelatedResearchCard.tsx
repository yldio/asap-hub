import { EventResponse, gp2 as gp2Model } from '@asap-hub/model';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { ComponentPropsWithRef } from 'react';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop, ResearchOutputOption } from '../utils';
import { createArticleSelectComponents } from '../utils/article-select-components';

type ResearchOutputRelatedResearchProps<
  T extends
    | EventResponse['relatedResearch']
    | gp2Model.OutputResponse['relatedOutputs'],
> = {
  readonly relatedResearch: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputOption>
  >['values'];
  readonly getRelatedResearchSuggestions?: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputOption>
  >['loadOptions'];
  readonly onChangeRelatedResearch?: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputOption>
  >['onChange'];

  readonly isSaving: boolean;
  isEditMode?: boolean;
  description?: string;
  getIconForDocumentType: (
    documentType: T[number]['documentType'],
  ) => EmotionJSX.Element;
};

const ResearchOutputRelatedResearchCard = <
  T extends
    | EventResponse['relatedResearch']
    | gp2Model.OutputResponse['relatedOutputs'],
>({
  relatedResearch,
  getRelatedResearchSuggestions = noop,
  onChangeRelatedResearch = noop,
  isSaving,
  isEditMode,
  description = `List all resources that were important to the creation of this output.
      Only published outputs on the CRN Hub will be available below.`,
  getIconForDocumentType,
}: ResearchOutputRelatedResearchProps<T>) => {
  const articleSelectComponents =
    createArticleSelectComponents<ResearchOutputOption>({
      getIcon: (data) =>
        getIconForDocumentType(data.documentType as T[number]['documentType']),
      showArticlePill: (data) => data.documentType === 'Article',
    });

  return (
    <FormCard title="Are there any related outputs?" description={description}>
      <LabeledMultiSelect<ResearchOutputOption>
        title="Related Outputs"
        description=""
        subtitle="(optional)"
        enabled={!isSaving || !isEditMode}
        placeholder="Start typing..."
        loadOptions={getRelatedResearchSuggestions}
        onChange={onChangeRelatedResearch}
        values={relatedResearch}
        noOptionsMessage={({ inputValue }) =>
          `Sorry, no related outputs match ${inputValue}`
        }
        components={articleSelectComponents}
      />
    </FormCard>
  );
};
export default ResearchOutputRelatedResearchCard;
