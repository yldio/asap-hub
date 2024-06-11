import {
  ApcCoverageOption,
  manuscriptFormFieldsMapping,
  ManuscriptLifecycle,
  ManuscriptPostRequest,
  ManuscriptResponse,
  ManuscriptType,
  manuscriptTypeLifecycles,
  manuscriptTypes,
  ManuscriptVersion,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  FormCard,
  LabeledDropdown,
  LabeledRadioButtonGroup,
  LabeledTextField,
} from '..';
import { Button } from '../atoms';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { mobileScreen, rem } from '../pixels';

const mainStyles = css({
  display: 'flex',
  justifyContent: 'center',
  padding: defaultPageLayoutPaddingStyle,
});

const contentStyles = css({
  display: 'grid',
  gridTemplateColumns: '1fr',
  width: '100%',
  maxWidth: rem(800),
  justifyContent: 'center',
  gridAutoFlow: 'row',
  rowGap: rem(36),
});

const buttonsOuterContainerStyles = css({
  display: 'flex',
  justifyContent: 'end',
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    width: '100%',
  },
});

const buttonsInnerContainerStyles = css({
  display: 'flex',
  flexDirection: 'row',
  gap: rem(24),
  [`@media (max-width: ${mobileScreen.max}px)`]: {
    flexDirection: 'column-reverse',
    width: '100%',
  },
});

const preprintLifecycles = [
  'Preprint, version 1',
  'Preprint, version 2',
  'Preprint, version 3+',
];

const apcCoverageLifecycles = [
  'Typeset proof',
  'Publication',
  'Publication with addendum or corrigendum',
];

const optionalVersionFields: Array<
  keyof Omit<ManuscriptVersion, 'type' | 'lifecycle'>
> = ['preprintDoi', 'publicationDoi', 'requestingApcCoverage', 'otherDetails'];

type ManuscriptFormProps = {
  onSave: (output: ManuscriptPostRequest) => Promise<ManuscriptResponse | void>;
  onSuccess: () => void;
  teamId: string;
} & Partial<Pick<ManuscriptPostRequest, 'title'>> & {
    type?: ManuscriptVersion['type'] | '';
    lifecycle?: ManuscriptVersion['lifecycle'] | '';
    requestingApcCoverage?: ManuscriptVersion['requestingApcCoverage'] | '';
    preprintDoi?: ManuscriptVersion['preprintDoi'] | '';
    publicationDoi?: ManuscriptVersion['publicationDoi'] | '';
    otherDetails?: ManuscriptVersion['otherDetails'] | '';
  };

const ManuscriptForm: React.FC<ManuscriptFormProps> = ({
  onSave,
  onSuccess,
  teamId,
  title,
  type,
  lifecycle,
  requestingApcCoverage,
  preprintDoi,
  publicationDoi,
  otherDetails,
}) => {
  const history = useHistory();

  const methods = useForm<ManuscriptPostRequest>({
    mode: 'onBlur',
    defaultValues: {
      title: title || '',
      versions: [
        {
          type: type || '',
          lifecycle: lifecycle || '',
          preprintDoi: preprintDoi || '',
          requestingApcCoverage: requestingApcCoverage || '',
          publicationDoi: publicationDoi || '',
          otherDetails: otherDetails || '',
        },
      ],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    getValues,
    watch,
    setValue,
    reset,
  } = methods;

  const watchType = watch('versions.0.type');
  const watchLifecycle = watch('versions.0.lifecycle');

  useEffect(() => {
    if (!watchType) {
      setValue('versions.0.lifecycle', '');
    }
  }, [setValue, watchType]);

  useEffect(() => {
    if (watchType && watchLifecycle) {
      let fieldsToReset = optionalVersionFields;
      fieldsToReset = fieldsToReset.filter(
        (field) =>
          !manuscriptFormFieldsMapping[watchType][watchLifecycle].includes(
            field,
          ),
      );

      const obj = fieldsToReset.reduce(
        (map, field) => ({ ...map, [field]: '' }),
        {} as {
          [key in (typeof optionalVersionFields)[number]]:
            | ''
            | 'Already submitted';
        },
      );

      if (
        apcCoverageLifecycles.includes(watchLifecycle) &&
        !getValues('versions.0.requestingApcCoverage')
      ) {
        obj.requestingApcCoverage = 'Already submitted';
      }

      reset(
        {
          ...getValues(),
          versions: [
            {
              ...getValues().versions[0],
              ...obj,
            },
          ],
        },
        { keepDefaultValues: true },
      );
    }
  }, [getValues, reset, watchType, watchLifecycle]);

  const onSubmit = async (data: ManuscriptPostRequest) => {
    const versionData = data.versions[0] as ManuscriptVersion;
    await onSave({
      ...data,
      teamId,
      versions: [
        {
          ...versionData,
          publicationDoi: versionData?.publicationDoi || undefined,
          preprintDoi: versionData?.preprintDoi || undefined,
          otherDetails: versionData?.otherDetails || undefined,
          requestingApcCoverage:
            versionData?.requestingApcCoverage || undefined,
        },
      ],
    });

    onSuccess();
  };

  const lifecycleSuggestions =
    watchType === ''
      ? []
      : manuscriptTypeLifecycles
          .filter(({ types }) => types.includes(watchType))
          .map(({ lifecycle: lifecycleSuggestion }) => ({
            value: lifecycleSuggestion,
            label: lifecycleSuggestion,
          }));

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <main css={mainStyles}>
        <div css={contentStyles}>
          <FormCard title="What are you sharing?">
            <Controller
              name="title"
              control={control}
              rules={{
                required: 'Please enter a title.',
                maxLength: {
                  value: 256,
                  message: 'This title cannot exceed 256 characters.',
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <LabeledTextField
                  title="Title of Manuscript"
                  subtitle="(required)"
                  customValidationMessage={error?.message}
                  value={value}
                  onChange={onChange}
                  enabled={!isSubmitting}
                />
              )}
            />

            <Controller
              name="versions.0.type"
              control={control}
              rules={{
                required: 'Please select a type.',
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <LabeledDropdown<ManuscriptType | ''>
                  title="Type of Manuscript"
                  subtitle="(required)"
                  description="Select the type that matches your manuscript the best."
                  options={manuscriptTypes.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  onChange={onChange}
                  customValidationMessage={error?.message}
                  value={value}
                  enabled={!isSubmitting}
                  noOptionsMessage={(option) =>
                    `Sorry, no types match ${option.inputValue}`
                  }
                  placeholder="Choose a type of manuscript"
                />
              )}
            />

            {watchType && (
              <Controller
                name="versions.0.lifecycle"
                control={control}
                rules={{
                  required: 'Please select an option.',
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <LabeledDropdown<ManuscriptLifecycle | ''>
                    title="Where is the manuscript in the life cycle?"
                    subtitle="(required)"
                    description="Select the option that matches your manuscript the best."
                    options={lifecycleSuggestions}
                    onChange={onChange}
                    customValidationMessage={error?.message}
                    value={value}
                    enabled={!isSubmitting}
                    noOptionsMessage={(option) =>
                      `Sorry, no options match ${option.inputValue}`
                    }
                    placeholder="Choose an option"
                  />
                )}
              />
            )}

            {watchType &&
              watchLifecycle &&
              manuscriptFormFieldsMapping[watchType][watchLifecycle].includes(
                'preprintDoi',
              ) && (
                <Controller
                  name="versions.0.preprintDoi"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^10\.\d{4}.*$/,
                      message: 'Your preprint DOI must start with 10.',
                    },
                    required:
                      preprintLifecycles.includes(watchLifecycle) &&
                      'Please enter a Preprint DOI',
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Preprint DOI"
                      subtitle={
                        preprintLifecycles.includes(watchLifecycle)
                          ? '(required)'
                          : '(optional)'
                      }
                      description="Your preprint DOI must start with 10."
                      onChange={onChange}
                      customValidationMessage={error?.message}
                      value={value ?? ''}
                      enabled={!isSubmitting}
                      placeholder="e.g. 10.5555/YFRU1371"
                    />
                  )}
                />
              )}

            {watchType &&
              watchLifecycle &&
              manuscriptFormFieldsMapping[watchType][watchLifecycle].includes(
                'publicationDoi',
              ) && (
                <Controller
                  name="versions.0.publicationDoi"
                  control={control}
                  rules={{
                    pattern: {
                      value: /^10\.\d{4}.*$/,
                      message: 'Your publication DOI must start with 10.',
                    },
                    required: 'Please enter a Publication DOI',
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Publication DOI"
                      subtitle={'(required)'}
                      description="Your publication DOI must start with 10."
                      onChange={onChange}
                      customValidationMessage={error?.message}
                      value={value ?? ''}
                      enabled={!isSubmitting}
                      placeholder="e.g. 10.5555/YFRU1371"
                    />
                  )}
                />
              )}

            {watchType &&
              watchLifecycle &&
              manuscriptFormFieldsMapping[watchType][watchLifecycle].includes(
                'requestingApcCoverage',
              ) && (
                <Controller
                  name="versions.0.requestingApcCoverage"
                  control={control}
                  rules={{
                    required: 'Please select an option',
                  }}
                  render={({ field: { value, onChange } }) => (
                    <LabeledRadioButtonGroup<ApcCoverageOption | ''>
                      title="Will you be requesting APC coverage"
                      subtitle="(required)"
                      options={[
                        {
                          value: 'Yes',
                          label: 'Yes',
                          disabled: isSubmitting,
                        },
                        {
                          value: 'No',
                          label: 'No',
                          disabled: isSubmitting,
                        },
                        {
                          value: 'Already submitted',
                          label: 'Already submitted',
                          disabled: isSubmitting,
                        },
                      ]}
                      value={value || 'Already submitted'}
                      onChange={onChange}
                    />
                  )}
                />
              )}

            {watchType &&
              watchLifecycle &&
              manuscriptFormFieldsMapping[watchType][watchLifecycle].includes(
                'otherDetails',
              ) && (
                <Controller
                  name="versions.0.otherDetails"
                  control={control}
                  rules={{
                    required: 'Please provide details',
                    maxLength: {
                      value: 256,
                      message: 'Details cannot exceed 256 characters.',
                    },
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Please provide details"
                      subtitle={'(required)'}
                      onChange={onChange}
                      customValidationMessage={error?.message}
                      value={value ?? ''}
                      enabled={!isSubmitting}
                    />
                  )}
                />
              )}
          </FormCard>

          <div css={buttonsOuterContainerStyles}>
            <div css={buttonsInnerContainerStyles}>
              <Button
                noMargin
                enabled={!isSubmitting}
                onClick={() => history.goBack()}
              >
                Cancel
              </Button>
              <Button
                primary
                noMargin
                submit
                enabled={!isSubmitting}
                preventDefault={false}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </main>
    </form>
  );
};

export default ManuscriptForm;
