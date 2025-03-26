import {
  ComplianceReportFormData,
  ComplianceReportPostRequest,
  ComplianceReportResponse,
  ManuscriptDataObject,
} from '@asap-hub/model';
import { urlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  GlobeIcon,
  info100,
  info500,
  LabeledDropdown,
  LabeledTextField,
} from '..';
import { Button, Card, Paragraph } from '../atoms';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { LabeledTextEditor } from '../molecules';
import { ConfirmModal } from '../organisms';
import { mobileScreen, perRem, rem } from '../pixels';
import { Option } from '../select';

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
  manuscriptId: string;
  onSave: (
    output: ComplianceReportPostRequest,
  ) => Promise<ComplianceReportResponse | void>;
  onSuccess: () => void;
  setManuscript: React.Dispatch<
    React.SetStateAction<ManuscriptDataObject | undefined>
  >;
};

type FormAction = 'cancel' | 'confirm' | 'confirmClosedStatus' | '';

const manuscriptStatus = [
  'Waiting for Report',
  'Review Compliance Report',
  'Manuscript Resubmitted',
  'Submit Final Publication',
  'Addendum Required',
  'Compliant',
  'Closed (other)',
] as const;

type ManuscriptStatus = (typeof manuscriptStatus)[number];

const manuscriptStatusOptions: ReadonlyArray<Option<ManuscriptStatus>> =
  manuscriptStatus.map((status) => ({
    label: status,
    value: status,
  }));

const getModalContent = (
  formAction: FormAction | '',
): {
  title: string;
  content: string;
  confirmButtonText: string;
  confirmButtonStyle: 'primary' | 'warning';
} =>
  ({
    confirm: {
      title: 'Share compliance report?',
      content:
        'If you elect to share the compliance report, all associated team members (First Author(s), PM, PIs, Corresponding Author and Additional Authors) will receive a reminder on the CRN Hub and an email to notify them that this report is now available.',
      confirmButtonText: 'Share Compliance Report',
      confirmButtonStyle: 'primary' as const,
    },
    confirmClosedStatus: {
      title:
        'Share compliance report and set status to <compliant/closed (other)>?',
      content:
        'After you update the status to <compliant/closed (other)>, this change will be permanent and cannot be altered. If you need to make changes in the future, please reach out to the CMS admin. Additionally, by sharing the compliance report, all associated team members (First Author(s), PM, PIs, Corresponding Author and Additional Authors) will receive a reminder on the CRN Hub and an email to notify them that this report is now available.',
      confirmButtonText: 'Confirm and Share',
      confirmButtonStyle: 'primary' as const,
    },
    cancel: {
      title: 'Cancel sharing of compliance report?',
      content:
        'Cancelling now will result in the loss of all entered data and will exit you from the sharing compliance report form.',
      confirmButtonText: 'Cancel Compliance Report Sharing',
      confirmButtonStyle: 'warning',
    },
  })[formAction !== '' ? formAction : 'cancel'];

const ComplianceReportForm: React.FC<ComplianceReportFormProps> = ({
  onSave,
  onSuccess,
  setManuscript,
  manuscriptTitle,
  manuscriptVersionId,
  url,
  description,
  manuscriptId,
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
    watch,
  } = methods;

  const selectedStatus = watch('status');

  const onSubmit = async (data: ComplianceReportFormData) => {
    const response = await onSave({
      ...data,
      manuscriptVersionId,
      manuscriptId,
    });
    if (!response) return;

    const { status, complianceReport } = response;

    if (complianceReport) {
      setManuscript(
        (manuscript) =>
          manuscript && {
            ...manuscript,
            status,
            versions: [
              {
                // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
                ...manuscript.versions[0]!,
                complianceReport,
              },
              ...manuscript.versions.slice(1),
            ],
          },
      );
    }
    onSuccess();
  };

  const [complianceReportFormAction, setComplianceReportFormAction] = useState<
    'confirm' | 'cancel' | 'confirmClosedStatus' | ''
  >('');

  const { title, confirmButtonText, confirmButtonStyle, content } =
    getModalContent(complianceReportFormAction);

  const editorRef = useRef<HTMLDivElement>(null);

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
                  onKeyDown={(e) => {
                    if (e.key === 'Tab' && !e.shiftKey && editorRef.current) {
                      e.preventDefault(); // Stop default tab behavior
                      editorRef.current.focus();
                    }
                  }}
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
                <LabeledTextEditor
                  ref={editorRef}
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
                  required
                  enabled={!isSubmitting}
                  editorStyles={css({
                    marginBlock: 0,
                  })}
                  hasError={Boolean(error)}
                  autofocus={false}
                />
              )}
            />

            <Controller
              name="status"
              control={control}
              rules={{
                required: 'Please select an option.',
              }}
              render={({ field: { value, onChange } }) => (
                <LabeledDropdown
                  name="Status"
                  title="Status"
                  subtitle="(required)"
                  options={manuscriptStatusOptions}
                  required
                  enabled={true}
                  placeholder="Choose an option"
                  value={value ?? ''}
                  onChange={onChange}
                  renderValue={(val) =>
                    val && (
                      <span
                        css={css({
                          backgroundColor: info100.rgba,
                          color: info500.rgba,
                          padding: '0em 1em',
                          borderRadius: `${24 / perRem}em`,
                          fontSize: '0.9em',
                          marginLeft: '0.1em',
                        })}
                      >
                        {val}
                      </span>
                    )
                  }
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
                onClick={() =>
                  setComplianceReportFormAction(
                    selectedStatus &&
                      (selectedStatus.includes('Compliant') ||
                        selectedStatus.includes('Closed (other)'))
                      ? 'confirmClosedStatus'
                      : 'confirm',
                  )
                }
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
