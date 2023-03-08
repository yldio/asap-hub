import { ComponentPropsWithRef } from 'react';
import { css } from '@emotion/react';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop, ResearchOutputOption } from '../utils';
import { components } from 'react-select';
import { perRem } from '../pixels';
import { getIconForDocumentType } from './RecentSharedOutputs';
import { Tag } from '../atoms';

const optionStyles = css({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  '*': {
    paddingRight: `${12 / perRem}em`,
    maxHeight: '24px',
  },
  svg: {
    width: '18px',
    height: '18px',
  },
});

type ResearchOutputRelatedResearchProps = {
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
};

const ResearchOutputRelatedResearchCard: React.FC<
  ResearchOutputRelatedResearchProps
> = ({
  relatedResearch,
  getRelatedResearchSuggestions = noop,
  onChangeRelatedResearch = noop,
  isSaving,
  isEditMode,
}) => (
  <FormCard title="Are there any related outputs?">
    <LabeledMultiSelect<ResearchOutputOption>
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
      components={{
        MultiValueContainer: (multiValueContainerProps) => (
          <div
            css={{
              ...multiValueContainerProps.selectProps.styles.multiValue(),
              paddingLeft: `${8 / perRem}em`,
            }}
          >
            {multiValueContainerProps.children}
          </div>
        ),
        MultiValueLabel: (multiValueLabelProps) => (
          <components.MultiValueLabel {...multiValueLabelProps}>
            <div css={optionStyles}>
              {getIconForDocumentType(multiValueLabelProps.data.documentType)}
              <span>{multiValueLabelProps.children}</span>
              <Tag>{multiValueLabelProps.data.type}</Tag>
            </div>
          </components.MultiValueLabel>
        ),
        Option: (optionProps) => (
          <components.Option {...optionProps}>
            <div css={optionStyles}>
              {getIconForDocumentType(optionProps.data.documentType)}
              <span>{optionProps.children}</span>
              <Tag>{optionProps.data.type}</Tag>
            </div>
          </components.Option>
        ),
      }}
    />
  </FormCard>
);
export default ResearchOutputRelatedResearchCard;
