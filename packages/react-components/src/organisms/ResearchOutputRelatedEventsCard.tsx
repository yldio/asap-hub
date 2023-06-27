import { FormCard, LabeledMultiSelect } from '../molecules';
import { components } from 'react-select';
import { perRem } from '../pixels';
import { MultiSelectOptionsType, Pill } from '../atoms';
import { EventResponse } from '@asap-hub/model';
import { ComponentPropsWithRef } from 'react';
import { noop } from '../utils';
import { formatDateToTimezone } from '../date';
import { css } from '@emotion/react';

export type ResearchOutputRelatedEventsOption = Pick<EventResponse, 'endDate'> &
  MultiSelectOptionsType;

type ResearchOutputRelatedEventsCardProps = {
  readonly relatedEvents: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['values'];
  readonly getRelatedEventSuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['loadOptions'];
  readonly onChangeRelatedEvents?: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['onChange'];

  readonly isSaving: boolean;
  isEditMode?: boolean;
};

const optionStyles = css({
  display: 'grid',
  gridTemplateColumns: `max-content auto`,
  justifyItems: 'start',
  alignItems: 'top',
  alignContent: 'center',
  columnGap: '12px',
});

const ResearchOutputRelatedEventsCard: React.FC<
  ResearchOutputRelatedEventsCardProps
> = ({
  isSaving,
  isEditMode,
  relatedEvents,
  getRelatedEventSuggestions = noop,
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
      loadOptions={getRelatedEventSuggestions}
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
            <div css={optionStyles}>
              <span>{multiValueLabelProps.children}</span>
              <Pill accent="gray">
                {formatDateToTimezone(
                  multiValueLabelProps.data.endDate,
                  'EEE, dd MMM yyyy',
                ).toUpperCase()}
              </Pill>
            </div>
          </components.MultiValueLabel>
        ),
        Option: (optionProps) => (
          <components.Option {...optionProps}>
            <div css={optionStyles}>
              <div>{optionProps.children}</div>
              <Pill accent="gray">
                {formatDateToTimezone(
                  optionProps.data.endDate,
                  'EEE, dd MMM yyyy',
                ).toUpperCase()}
              </Pill>
            </div>
          </components.Option>
        ),
      }}
    />
  </FormCard>
);

export default ResearchOutputRelatedEventsCard;
