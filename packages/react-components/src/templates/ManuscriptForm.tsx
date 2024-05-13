import { ManuscriptPostRequest, ManuscriptResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
// import { ajvResolver } from '@hookform/resolvers/ajv';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { FormCard, LabeledTextField } from '..';
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
};

const ManuscriptForm: React.FC<ManuscriptFormProps> = ({ onSave }) => {
  const methods = useForm<ManuscriptPostRequest>({
    // resolver: ajvResolver(manuscriptPostRequestSchema),
    mode: 'onBlur',
    defaultValues: {
      title: '',
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { isSubmitting },
    // formState: { errors },
  } = methods;

  // eslint-disable-next-line no-console
  console.log('watch', watch());
  const onSubmit = async (data: ManuscriptPostRequest) => {
    await onSave(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <main css={mainStyles}>
        <div css={contentStyles}>
          <FormCard title="What are you sharing?">
            <Controller
              name="title"
              control={control}
              rules={{ required: true }}
              render={({ field: { value, onChange } }) => (
                <LabeledTextField
                  title="Title of Manuscript"
                  maxLength={350}
                  subtitle="(required)"
                  //   customValidationMessage={titleValidationMessage}
                  getValidationMessage={(validationState) =>
                    validationState.valueMissing ||
                    validationState.patternMismatch
                      ? 'Please enter a title'
                      : undefined
                  }
                  required
                  value={value}
                  onChange={onChange}
                  enabled={!isSubmitting}
                />
              )}
            />
          </FormCard>

          <div css={buttonsOuterContainerStyles}>
            <div css={buttonsInnerContainerStyles}>
              <Button
                noMargin
                enabled={!isSubmitting}
                onClick={() => null} // TODO: IMPLEMENT THIS
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
                {isSubmitting ? 'Submitting...' : 'Submit'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </form>
  );
};

export default ManuscriptForm;
