import { FormCard, LabeledMultiSelect } from '../molecules';
import { components } from 'react-select';
import { perRem } from '../pixels';
import { MultiSelectOptionsType, Pill } from '../atoms';
import { ResearchOutputResponse } from '@asap-hub/model';
import { ComponentPropsWithRef } from 'react';
import { noop } from '../utils';

export type ResearchOutputRelatedEventsOption = Pick<
  ResearchOutputResponse,
  'type' | 'documentType'
> &
  MultiSelectOptionsType;

type ResearchOutputRelatedEventsCardProps = {
  readonly relatedEvents: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['values'];
  readonly getRelatedEventsSuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['loadOptions'];
  readonly onChangeRelatedEvents?: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['onChange'];

  readonly isSaving: boolean;
  isEditMode?: boolean;
};

const ResearchOutputRelatedEventsCard: React.FC<
  ResearchOutputRelatedEventsCardProps
> = ({
  isSaving,
  isEditMode,
  relatedEvents,
  getRelatedEventsSuggestions = noop,
  onChangeRelatedEvents = noop,
}) => (
  <FormCard
    title="Are there any related CRN Hub events?"
    description="List all CRN Hub events that are related to this output."
  >
    <LabeledMultiSelect<ResearchOutputRelatedEventsOption>
      title="Related CRN Hub Events"
      subtitle="(optional)"
      enabled={!isSaving || !isEditMode}
      placeholder="Start typing..."
      loadOptions={getRelatedEventsSuggestions}
      values={relatedEvents}
      onChange={onChangeRelatedEvents}
      noOptionsMessage={({ inputValue }) =>
        `Sorry, no related events match ${inputValue}`
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
            <div>
              <span>{multiValueLabelProps.children}</span>
              {multiValueLabelProps.data.documentType === 'Article' && (
                <Pill accent="gray">{multiValueLabelProps.data.type}</Pill>
              )}
            </div>
          </components.MultiValueLabel>
        ),
        Option: (optionProps) => (
          <components.Option {...optionProps}>
            <div>
              <div>{optionProps.children}</div>
              {optionProps.data.documentType === 'Article' && (
                <Pill accent="gray">{optionProps.data.type}</Pill>
              )}
            </div>
          </components.Option>
        ),
      }}
    />
  </FormCard>
);

export default ResearchOutputRelatedEventsCard;
