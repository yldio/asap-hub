import { EventResponse, gp2 as gp2Model } from '@asap-hub/model';
import { css } from '@emotion/react';
import type { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import { ComponentPropsWithRef } from 'react';
import { components } from 'react-select';

import { Pill } from '../atoms';
import { charcoal } from '../colors';
import { FormCard, LabeledMultiSelect } from '../molecules';
import { rem } from '../pixels';
import { getMultiValueStyles } from '../select';
import { noop, ResearchOutputOption } from '../utils';

const optionStyles = (showPill: boolean) =>
  css({
    display: 'grid',
    gridTemplateColumns: `min-content${showPill ? ' min-content' : ''} auto`,
    justifyItems: 'start',
    alignItems: 'top',
    alignContent: 'center',
    columnGap: '12px',
  });

const iconStyles = css({
  svg: {
    width: '18px',
    height: '18px',
    paddingLeft: rem(3),
    paddingTop: rem(4.5),
    stroke: charcoal.rgb,
    strokeWidth: rem(0.3),
  },
});

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
}: ResearchOutputRelatedResearchProps<T>) => (
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
      components={{
        MultiValueContainer: (multiValueContainerProps) => (
          <div
            css={{
              ...getMultiValueStyles(
                multiValueContainerProps.selectProps.styles,
              ),
              paddingLeft: rem(8),
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
              {
                <div css={iconStyles}>
                  {getIconForDocumentType(
                    multiValueLabelProps.data.documentType,
                  )}
                </div>
              }
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
              {
                <div css={iconStyles}>
                  {getIconForDocumentType(
                    optionProps.data.documentType as T[number]['documentType'],
                  )}
                </div>
              }
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
