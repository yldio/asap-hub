import { ComponentPropsWithRef } from 'react';
import { css } from '@emotion/react';
import { components } from 'react-select';

import { FormCard, LabeledMultiSelect } from '../molecules';
import { noop, ResearchOutputOption } from '../utils';
import { perRem } from '../pixels';
import { getIconForDocumentType } from './RecentSharedOutputs';
import { Pill } from '../atoms';

const optionStyles = (showPill: boolean) =>
  css({
    display: 'grid',
    gridTemplateColumns: `min-content${showPill ? ' min-content' : ''} auto`,
    justifyItems: 'start',
    alignItems: 'center',
    alignContent: 'center',
    columnGap: '12px',
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
  <FormCard
    title="Are there any related outputs?"
    description="List all resources that were important to the creation of this output.
      Only published outputs on the CRN Hub will be available below."
  >
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
            <div
              css={optionStyles(
                multiValueLabelProps.data.documentType === 'Article',
              )}
            >
              {getIconForDocumentType(multiValueLabelProps.data.documentType)}
              {multiValueLabelProps.data.documentType === 'Article' && (
                <Pill accent="gray">{multiValueLabelProps.data.type}</Pill>
              )}
              <span>{multiValueLabelProps.children}</span>
            </div>
          </components.MultiValueLabel>
        ),
        Option: (optionProps) => (
          <components.Option {...optionProps}>
            <div
              css={optionStyles(optionProps.data.documentType === 'Article')}
            >
              {getIconForDocumentType(optionProps.data.documentType)}
              {optionProps.data.documentType === 'Article' && (
                <Pill accent="gray">{optionProps.data.type}</Pill>
              )}
              <div>{optionProps.children}</div>
            </div>
          </components.Option>
        ),
      }}
    />
  </FormCard>
);
export default ResearchOutputRelatedResearchCard;
