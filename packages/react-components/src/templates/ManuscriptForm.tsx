import {
  ManuscriptLifecycle,
  ManuscriptPostRequest,
  ManuscriptResponse,
  ManuscriptType,
  manuscriptTypeLifecycles,
  manuscriptTypes,
  ManuscriptVersion,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { FormCard, LabeledDropdown, LabeledTextField } from '..';
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

type ManuscriptFormProps = {
  onSave: (output: ManuscriptPostRequest) => Promise<ManuscriptResponse | void>;
  onSuccess: () => void;
  teamId: string;
} & Partial<Pick<ManuscriptPostRequest, 'title'>> & {
    type?: ManuscriptVersion['type'] | '';
    lifecycle?: ManuscriptVersion['lifecycle'] | '';
  };

const ManuscriptForm = ({
  onSave,
  onSuccess,
  teamId,
  title,
  type,
  lifecycle,
}: ManuscriptFormProps) => {
  const navigate = useNavigate();

  const methods = useForm<ManuscriptPostRequest>({
    mode: 'onBlur',
    defaultValues: {
      title: title || '',
      versions: [
        {
          type: type || '',
          lifecycle: lifecycle || '',
        },
      ],
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    watch,
    setValue,
  } = methods;

  const watchType = watch('versions.0.type');

  useEffect(() => {
    if (!watchType) {
      setValue('versions.0.lifecycle', '');
    }
  }, [setValue, watchType]);

  const onSubmit = async (data: ManuscriptPostRequest) => {
    await onSave({ ...data, teamId });

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
          </FormCard>

          <div css={buttonsOuterContainerStyles}>
            <div css={buttonsInnerContainerStyles}>
              <Button
                noMargin
                enabled={!isSubmitting}
                onClick={() => navigate(-1)}
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
