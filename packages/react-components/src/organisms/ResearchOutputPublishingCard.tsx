import { DecisionOption, ResearchOutputSharingStatus } from '@asap-hub/model';
import { ResearchOutputAvailableActions } from '@asap-hub/react-context';
import { format } from 'date-fns';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import {
  FormCard,
  LabeledDateField,
  LabeledRadioButtonGroup,
} from '../molecules';
import { parseDateToString } from '../molecules/LabeledDateField';
import { ResearchOutputFormValues } from '../utils';

export type ResearchOutputPublishingCardProps = Pick<
  ResearchOutputAvailableActions,
  | 'disableDateMadePublic'
  | 'disableUsedInPublication'
  | 'disableNonPublicSharingStatus'
>;

export const requiredPublishDateMessage = 'Please enter the date made public.';
export const futurePublishDateMessage =
  'Publish date cannot be greater than today';

// The value is stored at UTC midnight while `max` is a local calendar day, so
// both sides are compared as the yyyy-MM-dd string the user actually sees.
const isNotInTheFuture = (publishDate?: Date) =>
  !publishDate ||
  parseDateToString(publishDate) <= format(new Date(), 'yyyy-MM-dd');

const ResearchOutputPublishingCard: React.FC<
  ResearchOutputPublishingCardProps
> = ({
  disableDateMadePublic,
  disableUsedInPublication,
  disableNonPublicSharingStatus,
}) => {
  const { control } = useFormContext<ResearchOutputFormValues>();
  const sharingStatus = useWatch({ control, name: 'sharingStatus' });

  return (
    <FormCard title="Funding and Publication Details">
      <Controller
        name="asapFunded"
        control={control}
        render={({ field: { value, onChange } }) => (
          <LabeledRadioButtonGroup
            title="Has this output been funded by ASAP?"
            subtitle="(required)"
            options={[
              { value: 'Yes', label: 'Yes' },
              { value: 'No', label: 'No' },
              { value: 'Not Sure', label: 'Not Sure' },
            ]}
            value={value ?? 'Not Sure'}
            onChange={onChange as (newValue: DecisionOption) => void}
          />
        )}
      />

      <Controller
        name="usedInPublication"
        control={control}
        render={({ field: { value, onChange } }) => (
          <LabeledRadioButtonGroup
            title="Has this output been used in a publication?"
            subtitle="(required)"
            options={[
              { value: 'Yes', label: 'Yes' },
              {
                value: 'No',
                label: 'No',
                disabled: disableUsedInPublication,
              },
              {
                value: 'Not Sure',
                label: 'Not Sure',
                disabled: disableUsedInPublication,
              },
            ]}
            value={value ?? 'Not Sure'}
            onChange={onChange as (newValue: DecisionOption) => void}
          />
        )}
      />

      <Controller
        name="sharingStatus"
        control={control}
        render={({ field: { value, onChange } }) => (
          <LabeledRadioButtonGroup
            title="Sharing status"
            subtitle="(required)"
            options={[
              {
                value: 'Network Only',
                label: 'CRN Only',
                disabled: disableNonPublicSharingStatus,
              },
              { value: 'Public', label: 'Public' },
            ]}
            value={value ?? 'Network Only'}
            onChange={
              onChange as (newValue: ResearchOutputSharingStatus) => void
            }
          />
        )}
      />

      {sharingStatus === 'Public' ? (
        <Controller
          name="publishDate"
          control={control}
          rules={{
            required: requiredPublishDateMessage,
            validate: (value) =>
              isNotInTheFuture(value) || futurePublishDateMessage,
          }}
          render={({
            field: { value, onChange, onBlur },
            fieldState: { error },
          }) => (
            <LabeledDateField
              title={'Date made public'}
              subtitle={'(required)'}
              description={
                'The date this output first became publicly available.'
              }
              enabled={!disableDateMadePublic}
              onChange={(date) => onChange(date ? new Date(date) : undefined)}
              onBlur={onBlur}
              value={value}
              max={new Date()}
              customValidationMessage={error?.message}
            />
          )}
        />
      ) : null}
    </FormCard>
  );
};

export default ResearchOutputPublishingCard;
