import {
  ComplianceReportFormData,
  ComplianceReportPostRequest,
  ComplianceReportResponse,
} from '@asap-hub/model';
import { urlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import { GlobeIcon, LabeledTextArea, LabeledTextField } from '..';
import { Button, Card, Paragraph } from '../atoms';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { ConfirmModal } from '../organisms';
import { mobileScreen, rem } from '../pixels';

const mainStyles = css({
  display: 'flex',
  justifyContent: 'center',
  padding: defaultPageLayoutPaddingStyle,
});

const cardStyles = css({
  padding: `${rem(32)} ${rem(24)} ${rem(16)}`,
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

type ComplianceReportFormProps = {
  manuscriptTitle: string;
  manuscriptVersionId: string;
  url?: string;
  description?: string | '';
  onSave: (
    output: ComplianceReportPostRequest,
  ) => Promise<ComplianceReportResponse | void>;
  onSuccess: () => void;
};

type FormAction = 'cancel' | 'confirm' | '';

const getModalContent = (
  formAction: FormAction,
): {
  title: string;
  content: string;
  confirmButtonText: string;
  confirmButtonStyle: 'primary' | 'warning';
} =>
  formAction && formAction === 'confirm'
    ? {
        title: 'Share compliance report?',
        content:
          'If you elect to share the compliance report, all associated team members (First Author(s), PM, PIs, Corresponding Author and Additional Authors) will receive a reminder on the CRN Hub and an email to notify them that this report is now available.',
        confirmButtonText: 'Share Compliance Report',
        confirmButtonStyle: 'primary',
      }
    : {
        title: 'Cancel sharing of compliance report?',
        content:
          'Cancelling now will result in the loss of all entered data and will exit you from the sharing compliance report form.',
        confirmButtonText: 'Cancel Compliance Report Sharing',
        confirmButtonStyle: 'warning',
      };

const ComplianceReportForm: React.FC<ComplianceReportFormProps> = ({
  onSave,
  onSuccess,
  manuscriptTitle,
  manuscriptVersionId,
  url,
  description,
}) => {
  const history = useHistory();

  const methods = useForm<ComplianceReportFormData>({
    mode: 'onBlur',
    defaultValues: {
      url: url || '',
      description: description || '',
    },
  });

  const {
    handleSubmit,
    control,
    formState: { isSubmitting, isValid },
  } = methods;

  const onSubmit = async (data: ComplianceReportFormData) => {
    await onSave({
      ...data,
      manuscriptVersionId,
    });
    onSuccess();
  };

  const [complianceReportFormAction, setComplianceReportFormAction] = useState<
    'confirm' | 'cancel' | ''
  >('');

  const { title, confirmButtonText, confirmButtonStyle, content } =
    getModalContent(complianceReportFormAction);

  return (
    <form>
      <main css={mainStyles}>
        {complianceReportFormAction && (
          <ConfirmModal
            title={title}
            description={content}
            cancelText="Keep Editing"
            confirmText={confirmButtonText}
            confirmButtonStyle={confirmButtonStyle}
            onSave={
              complianceReportFormAction === 'confirm'
                ? () => handleSubmit(onSubmit)()
                : () => history.goBack()
            }
            onCancel={() => setComplianceReportFormAction('')}
          />
        )}
        <div css={contentStyles}>
          <Card overrideStyles={cardStyles}>
            <Paragraph noMargin>
              <strong>Title of Manuscript</strong>
            </Paragraph>
            <Paragraph>{manuscriptTitle}</Paragraph>
            <Controller
              name="url"
              control={control}
              rules={{
                pattern: {
                  value: new RegExp(urlExpression),
                  message:
                    'Please enter a valid URL, starting with http:// or https://',
                },
                required: 'Please enter a url.',
              }}
              render={({
                field: { value, onBlur, onChange },
                fieldState: { error },
              }) => (
                <LabeledTextField
                  title="URL"
                  subtitle={'(required)'}
                  onChange={onChange}
                  onBlur={onBlur}
                  customValidationMessage={error?.message}
                  value={value || ''}
                  enabled={!isSubmitting}
                  labelIndicator={<GlobeIcon />}
                  placeholder="https://example.com"
                />
              )}
            />

            <Controller
              name="description"
              control={control}
              rules={{
                required: 'Please enter a description.',
              }}
              render={({
                field: { value, onBlur, onChange },
                fieldState: { error },
              }) => (
                <LabeledTextArea
                  title="Compliance Report Description"
                  subtitle="(required)"
                  tip={
                    <span>
                      Add a description to the compliance report. You can format
                      your text by using markup language.
                    </span>
                  }
                  customValidationMessage={error?.message}
                  value={value || ''}
                  onChange={onChange}
                  onBlur={onBlur}
                  enabled={!isSubmitting}
                />
              )}
            />
          </Card>
          <div css={buttonsOuterContainerStyles}>
            <div css={buttonsInnerContainerStyles}>
              <Button
                noMargin
                enabled={!isSubmitting}
                onClick={() => setComplianceReportFormAction('cancel')}
              >
                Cancel
              </Button>
              <Button
                primary
                noMargin
                enabled={!isSubmitting && isValid}
                onClick={() => setComplianceReportFormAction('confirm')}
              >
                Share
              </Button>
            </div>
          </div>
        </div>
      </main>
    </form>
  );
};

export default ComplianceReportForm;
