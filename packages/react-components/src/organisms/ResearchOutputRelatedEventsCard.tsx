import { EventResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ComponentPropsWithRef } from 'react';
import { components } from 'react-select';

import { MultiSelectOptionsType, Pill } from '../atoms';
import { formatDateToTimezone } from '../date';
import { FormCard, LabeledMultiSelect } from '../molecules';
import { perRem } from '../pixels';
import { noop } from '../utils';

export type ResearchOutputRelatedEventsOption = Pick<EventResponse, 'endDate'> &
  MultiSelectOptionsType;

type ResearchOutputRelatedEventsCardProps = {
  readonly relatedEvents: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['values'];
  readonly getRelatedEventSuggestions: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['loadOptions'];
  readonly onChangeRelatedEvents: ComponentPropsWithRef<
    typeof LabeledMultiSelect<ResearchOutputRelatedEventsOption>
  >['onChange'];

  readonly isSaving: boolean;
  isEditMode?: boolean;
  title?: string;
  description?: string;
  labelTitle?: string;
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
  title = 'Are there any related CRN Hub events?',
  description = 'Find all events related to this output.',
  labelTitle = 'Related CRN Hub Events',
}) => (
  <FormCard title={title} description={description}>
    <LabeledMultiSelect<ResearchOutputRelatedEventsOption>
      title={labelTitle}
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
              // TODO: fix this
              // ...multiValueContainerProps.selectProps.styles.multiValue(),
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
