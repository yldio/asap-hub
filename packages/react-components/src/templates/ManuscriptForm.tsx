import {
  ApcCoverageOption,
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptFormData,
  manuscriptFormFieldsMapping,
  ManuscriptLifecycle,
  ManuscriptPostRequest,
  ManuscriptResponse,
  ManuscriptType,
  manuscriptTypeLifecycles,
  manuscriptTypes,
  ManuscriptVersion,
  QuestionChecksOption,
  quickCheckQuestions,
} from '@asap-hub/model';
import { css } from '@emotion/react';
import React, { ComponentProps, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useHistory } from 'react-router-dom';
import {
  FormCard,
  LabeledDropdown,
  LabeledFileField,
  LabeledMultiSelect,
  LabeledRadioButtonGroup,
  LabeledTextField,
} from '..';
import { Button, Link, MultiSelectOptionsType } from '../atoms';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { mobileScreen, rem } from '../pixels';

const MAX_FILE_SIZE = 25_000_000;
const KRT_GUIDANCE_FILE =
  'https://docs.google.com/document/d/1FCnqC3VpvLFPLcshLSkmGPtRIFfh70MR7KkrXi7IMX4/edit?usp=sharing';
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

type OptionalVersionFields = Array<
  keyof Omit<
    ManuscriptVersion,
    'type' | 'lifecycle' | 'createdBy' | 'publishedAt'
  >
>;

type DefaultFieldValueMapping = Record<
  OptionalVersionFields[number],
  '' | 'Already submitted'
>;

const optionalVersionFields: OptionalVersionFields = [
  'preprintDoi',
  'publicationDoi',
  'requestingApcCoverage',
  'otherDetails',

  'acknowledgedGrantNumber',
  'asapAffiliationIncluded',
  'manuscriptLicense',
  'datasetsDeposited',
  'codeDeposited',
  'protocolsDeposited',
  'labMaterialsRegistered',
];

const getFieldsToReset = (
  fieldsList: OptionalVersionFields,
  manuscriptType: ManuscriptType,
  manuscriptLifecycle: ManuscriptLifecycle,
) =>
  fieldsList.filter(
    (field) =>
      !manuscriptFormFieldsMapping[manuscriptType][
        manuscriptLifecycle
      ].includes(field),
  );

const getDefaultRequestingApcCoverageValue = (
  lifecycle: ManuscriptLifecycle,
  requestingApcCoverage: ManuscriptVersion['requestingApcCoverage'] | '',
) =>
  apcCoverageLifecycles.includes(lifecycle) && !requestingApcCoverage
    ? 'Already submitted'
    : '';

const setDefaultFieldValues = (
  fieldsList: OptionalVersionFields,
  lifecycle: ManuscriptLifecycle,
  requestingApcCoverage: ManuscriptVersion['requestingApcCoverage'] | '',
) => {
  const fieldDefaultValueMap = fieldsList.reduce(
    (map, field) => ({ ...map, [field]: '' }),
    {} as DefaultFieldValueMapping,
  );

  // By default, in the ui the requestingApcCoverage radio button indicates as set to Already submitted but is not captured in formdata, this does that
  const defaultRequestingApcCoverageValue =
    getDefaultRequestingApcCoverageValue(lifecycle, requestingApcCoverage);

  if (defaultRequestingApcCoverageValue)
    fieldDefaultValueMap.requestingApcCoverage =
      defaultRequestingApcCoverageValue;

  return fieldDefaultValueMap;
};

type ManuscriptFormProps = Omit<
  ManuscriptVersion,
  | 'type'
  | 'lifecycle'
  | 'manuscriptFile'
  | 'keyResourceTable'
  | 'additionalFiles'
  | 'createdBy'
  | 'publishedAt'
  | 'teams'
  | 'labs'
> &
  Partial<Pick<ManuscriptPostRequest, 'title'>> & {
    type?: ManuscriptVersion['type'] | '';
    lifecycle?: ManuscriptVersion['lifecycle'] | '';
    manuscriptFile?: ManuscriptFileResponse;
    keyResourceTable?: ManuscriptFileResponse;
    additionalFiles?: ManuscriptFileResponse[];
    eligibilityReasons: Set<string>;
    onSave: (
      output: ManuscriptPostRequest,
    ) => Promise<ManuscriptResponse | void>;
    onSuccess: () => void;
    handleFileUpload: (
      file: File,
      fileType: ManuscriptFileType,
      handleError: (errorMessage: string) => void,
    ) => Promise<ManuscriptFileResponse | undefined>;
    teamId: string;
    getTeamSuggestions?: ComponentProps<
      typeof LabeledMultiSelect
    >['loadOptions'];
    selectedTeams: MultiSelectOptionsType[];
    getLabSuggestions?: ComponentProps<
      typeof LabeledMultiSelect
    >['loadOptions'];
  };

const ManuscriptForm: React.FC<ManuscriptFormProps> = ({
  onSave,
  onSuccess,
  handleFileUpload,
  teamId,
  title,
  type,
  lifecycle,
  manuscriptFile,
  keyResourceTable,
  additionalFiles,
  eligibilityReasons,
  requestingApcCoverage,
  preprintDoi,
  publicationDoi,
  otherDetails,
  acknowledgedGrantNumber,
  asapAffiliationIncluded,
  manuscriptLicense,
  datasetsDeposited,
  codeDeposited,
  protocolsDeposited,
  labMaterialsRegistered,
  acknowledgedGrantNumberDetails,
  asapAffiliationIncludedDetails,
  manuscriptLicenseDetails,
  datasetsDepositedDetails,
  codeDepositedDetails,
  protocolsDepositedDetails,
  labMaterialsRegisteredDetails,
  getTeamSuggestions,
  selectedTeams,
  getLabSuggestions,
}) => {
  const history = useHistory();

  const methods = useForm<ManuscriptFormData>({
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
          manuscriptFile: manuscriptFile || undefined,
          keyResourceTable: keyResourceTable || undefined,
          additionalFiles: additionalFiles || undefined,
          acknowledgedGrantNumber: acknowledgedGrantNumber || '',
          asapAffiliationIncluded: asapAffiliationIncluded || '',
          manuscriptLicense: manuscriptLicense || '',
          datasetsDeposited: datasetsDeposited || '',
          codeDeposited: codeDeposited || '',
          protocolsDeposited: protocolsDeposited || '',
          labMaterialsRegistered: labMaterialsRegistered || '',
          acknowledgedGrantNumberDetails: acknowledgedGrantNumberDetails || '',
          asapAffiliationIncludedDetails: asapAffiliationIncludedDetails || '',
          manuscriptLicenseDetails: manuscriptLicenseDetails || '',
          datasetsDepositedDetails: datasetsDepositedDetails || '',
          codeDepositedDetails: codeDepositedDetails || '',
          protocolsDepositedDetails: protocolsDepositedDetails || '',
          labMaterialsRegisteredDetails: labMaterialsRegisteredDetails || '',
          teams: selectedTeams || [],
        },
      ],
    },
  });

  const [isUploadingManuscriptFile, setIsUploadingManuscriptFile] =
    useState(false);
  const [isUploadingKeyResourceTable, setIsUploadingKeyResourceTable] =
    useState(false);
  const [isUploadingAdditionalFiles, setIsUploadingAdditionalFiles] =
    useState(false);

  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    getValues,
    watch,
    setValue,
    setError,
    reset,
    resetField,
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
      const fieldsToReset = getFieldsToReset(
        optionalVersionFields,
        watchType,
        watchLifecycle,
      );
      const fieldDefaultValueMap = setDefaultFieldValues(
        fieldsToReset,
        watchLifecycle,
        getValues('versions.0.requestingApcCoverage'),
      );

      reset(
        {
          ...getValues(),
          versions: [
            {
              ...getValues().versions[0],
              ...fieldDefaultValueMap,
              teams: selectedTeams,
              labs: [],
              manuscriptFile: undefined,
              keyResourceTable: undefined,
              additionalFiles: undefined,
            },
          ],
        },
        { keepDefaultValues: true },
      );
    }
  }, [getValues, reset, watchType, watchLifecycle, selectedTeams]);

  const onSubmit = async (data: ManuscriptFormData) => {
    const versionData = data.versions[0];

    if (versionData?.type && versionData.lifecycle) {
      await onSave({
        ...data,
        teamId,
        eligibilityReasons: [...eligibilityReasons],
        versions: [
          {
            ...versionData,
            publicationDoi: versionData?.publicationDoi || undefined,
            preprintDoi: versionData?.preprintDoi || undefined,
            otherDetails: versionData?.otherDetails || undefined,
            requestingApcCoverage:
              versionData?.requestingApcCoverage || undefined,

            acknowledgedGrantNumber:
              versionData.acknowledgedGrantNumber || undefined,
            asapAffiliationIncluded:
              versionData.asapAffiliationIncluded || undefined,
            manuscriptLicense: versionData.manuscriptLicense || undefined,
            datasetsDeposited: versionData.datasetsDeposited || undefined,
            codeDeposited: versionData.codeDeposited || undefined,
            protocolsDeposited: versionData.protocolsDeposited || undefined,
            labMaterialsRegistered:
              versionData.labMaterialsRegistered || undefined,

            acknowledgedGrantNumberDetails:
              versionData?.acknowledgedGrantNumber === 'No'
                ? versionData.acknowledgedGrantNumberDetails
                : '',
            asapAffiliationIncludedDetails:
              versionData?.asapAffiliationIncluded === 'No'
                ? versionData.asapAffiliationIncludedDetails
                : '',
            manuscriptLicenseDetails:
              versionData?.manuscriptLicense === 'No'
                ? versionData.manuscriptLicenseDetails
                : '',
            datasetsDepositedDetails:
              versionData?.datasetsDeposited === 'No'
                ? versionData.datasetsDepositedDetails
                : '',
            codeDepositedDetails:
              versionData?.codeDeposited === 'No'
                ? versionData.codeDepositedDetails
                : '',
            protocolsDepositedDetails:
              versionData?.protocolsDeposited === 'No'
                ? versionData.protocolsDepositedDetails
                : '',
            labMaterialsRegisteredDetails:
              versionData?.labMaterialsRegistered === 'No'
                ? versionData.labMaterialsRegisteredDetails
                : '',

            teams: versionData.teams.map((team) => team.value),
            labs: versionData.labs.map((lab) => lab.value),
          },
        ],
      });

      onSuccess();
    }
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

            {watchType && (
              <Controller
                name="versions.0.manuscriptFile"
                control={control}
                rules={{
                  required: 'Please select a manuscript file.',
                }}
                render={({ field: { value }, fieldState: { error } }) => (
                  <LabeledFileField
                    title="Upload the main manuscript file"
                    subtitle="(required)"
                    description="The main manuscript must be submitted as a single PDF file and should contain all primary and supplemental text, methods, and figures."
                    placeholder="Upload Manuscript File"
                    onRemove={() => {
                      resetField('versions.0.manuscriptFile');
                    }}
                    handleFileUpload={async (file) => {
                      if (file.size > MAX_FILE_SIZE) {
                        setError('versions.0.manuscriptFile', {
                          type: 'custom',
                          message: 'File is larger than 25MB.',
                        });
                      } else {
                        setIsUploadingManuscriptFile(true);
                        const uploadedFile = await handleFileUpload(
                          file,
                          'Manuscript File',
                          (validationErrorMessage) => {
                            setError('versions.0.manuscriptFile', {
                              type: 'custom',
                              message: validationErrorMessage,
                            });
                          },
                        );
                        setIsUploadingManuscriptFile(false);

                        if (!uploadedFile) return;

                        setValue('versions.0.manuscriptFile', uploadedFile, {
                          shouldValidate: true,
                        });
                      }
                    }}
                    currentFiles={value && [value]}
                    accept="application/pdf"
                    customValidationMessage={error?.message}
                    enabled={!isSubmitting && !isUploadingManuscriptFile}
                  />
                )}
              />
            )}
            {watchType &&
              watchLifecycle &&
              manuscriptFormFieldsMapping[watchType][watchLifecycle].includes(
                'keyResourceTable',
              ) && (
                <Controller
                  name="versions.0.keyResourceTable"
                  control={control}
                  rules={{
                    required: 'Please select a key resource table.',
                  }}
                  render={({ field: { value }, fieldState: { error } }) => (
                    <LabeledFileField
                      title="Upload a key resource table"
                      subtitle="(required)"
                      description={
                        <>
                          The key resource table must be submitted as a single
                          CSV file and should outline the resources used and
                          generated in this study. View guidance{' '}
                          {<Link href={KRT_GUIDANCE_FILE}>here</Link>}.
                        </>
                      }
                      placeholder="Upload Key Resource Table"
                      onRemove={() => {
                        resetField('versions.0.keyResourceTable');
                      }}
                      handleFileUpload={async (file) => {
                        if (file.size > MAX_FILE_SIZE) {
                          setError('versions.0.keyResourceTable', {
                            type: 'custom',
                            message: 'File is larger than 25MB.',
                          });
                        } else {
                          setIsUploadingKeyResourceTable(true);
                          const uploadedFile = await handleFileUpload(
                            file,
                            'Key Resource Table',
                            (validationErrorMessage) => {
                              setError('versions.0.keyResourceTable', {
                                type: 'custom',
                                message: validationErrorMessage,
                              });
                            },
                          );
                          setIsUploadingKeyResourceTable(false);

                          if (!uploadedFile) return;

                          setValue(
                            'versions.0.keyResourceTable',
                            uploadedFile,
                            {
                              shouldValidate: true,
                            },
                          );
                        }
                      }}
                      currentFiles={value && [value]}
                      accept="text/csv"
                      customValidationMessage={error?.message}
                      enabled={!isSubmitting && !isUploadingKeyResourceTable}
                    />
                  )}
                />
              )}
            {watchType && (
              <Controller
                name="versions.0.additionalFiles"
                control={control}
                render={({ field: { value }, fieldState: { error } }) => (
                  <LabeledFileField
                    title="Upload any additional files"
                    subtitle="(optional)"
                    description="Additional files must be submitted in PDF and/or CSV formats."
                    placeholder="Upload Additional Files"
                    onRemove={(id?: string) => {
                      setValue(
                        'versions.0.additionalFiles',
                        value?.filter(
                          (additionalFile) => additionalFile.id !== id,
                        ),
                      );
                    }}
                    maxFiles={5}
                    handleFileUpload={async (file) => {
                      const isExistingFile =
                        value &&
                        value.findIndex(
                          (additionalFile) =>
                            additionalFile.filename === file.name,
                        ) !== -1;
                      if (!isExistingFile) {
                        if (file.size > MAX_FILE_SIZE) {
                          setError('versions.0.additionalFiles', {
                            type: 'custom',
                            message: 'File is larger than 25MB.',
                          });
                        } else {
                          setIsUploadingAdditionalFiles(true);
                          const uploadedFile = await handleFileUpload(
                            file,
                            'Additional Files',
                            (validationErrorMessage) => {
                              setError('versions.0.additionalFiles', {
                                type: 'custom',
                                message: validationErrorMessage,
                              });
                            },
                          );
                          setIsUploadingAdditionalFiles(false);

                          if (!uploadedFile) return;

                          setValue(
                            'versions.0.additionalFiles',
                            [
                              ...(getValues('versions.0.additionalFiles') ||
                                []),
                              uploadedFile,
                            ],
                            {
                              shouldValidate: true,
                            },
                          );
                        }
                      } else {
                        setError('versions.0.additionalFiles', {
                          type: 'custom',
                          message: 'File uploaded already exists.',
                        });
                      }
                    }}
                    currentFiles={value}
                    customValidationMessage={error?.message}
                    accept="application/pdf,text/csv"
                    enabled={!isSubmitting && !isUploadingAdditionalFiles}
                  />
                )}
              />
            )}
          </FormCard>

          <FormCard key="contributors" title="Who were the contributors?">
            <Controller
              name="versions.0.teams"
              control={control}
              rules={{
                required: 'Please add at least one team.',
              }}
              render={({ field: { value, onChange } }) => (
                <LabeledMultiSelect
                  title="Teams"
                  description="Add other teams that contributed to this manuscript. The Project Manager and Lead PI from all teams listed will receive updates. They will also be able to edit the manuscript metadata and submit a new version of the manuscript."
                  subtitle="(required)"
                  enabled={!isSubmitting}
                  placeholder="Start typing..."
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  loadOptions={getTeamSuggestions!}
                  onChange={onChange}
                  values={value}
                  noOptionsMessage={({ inputValue }) =>
                    `Sorry, no teams match ${inputValue}`
                  }
                />
              )}
            />

            <Controller
              name="versions.0.labs"
              control={control}
              render={({ field: { value, onChange } }) => (
                <LabeledMultiSelect
                  title="Labs"
                  description="Add ASAP labs that contributed to this manuscript. Only labs whose PI is part of the CRN will appear. PIs for each listed lab will receive an update on this manuscript. In addition, they will be able to edit the manuscript metadata and can submit a new version of the manuscript."
                  subtitle="(optional)"
                  enabled={!isSubmitting}
                  placeholder="Start typing..."
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  loadOptions={getLabSuggestions!}
                  onChange={onChange}
                  values={value}
                  noOptionsMessage={({ inputValue }) =>
                    `Sorry, no labs match ${inputValue}`
                  }
                />
              )}
            />
          </FormCard>

          {watchType && watchLifecycle && (
            <FormCard
              key="quick-checks"
              title="Quick Checks"
              description="Before you submit your manuscript, please confirm that you have met the following requirements."
            >
              {quickCheckQuestions.map(
                ({ field, question }) =>
                  manuscriptFormFieldsMapping[watchType][
                    watchLifecycle
                  ].includes(field) && (
                    <div key={field}>
                      <Controller
                        name={`versions.0.${field}`}
                        control={control}
                        rules={{
                          required: 'Please select an option.',
                        }}
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => (
                          <LabeledRadioButtonGroup<QuestionChecksOption | ''>
                            title={question}
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
                            ]}
                            value={value as QuestionChecksOption}
                            onChange={onChange}
                            validationMessage={error?.message ?? ''}
                          />
                        )}
                      />
                      {watch(`versions.0.${field}`) === 'No' && (
                        <Controller
                          name={`versions.0.${field}Details`}
                          control={control}
                          rules={{
                            required: 'Please enter the details.',
                          }}
                          render={({
                            field: { value, onChange },
                            fieldState: { error },
                          }) => (
                            <LabeledTextField
                              title="Please provide details"
                              subtitle="(required)"
                              description="The reason you provide must be accepted by the Open Science team."
                              value={value || ''}
                              customValidationMessage={error?.message}
                              onChange={onChange}
                              enabled={!isSubmitting}
                            />
                          )}
                        />
                      )}
                    </div>
                  ),
              )}
            </FormCard>
          )}
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
                enabled={
                  !isSubmitting &&
                  !isUploadingManuscriptFile &&
                  !isUploadingKeyResourceTable &&
                  !isUploadingAdditionalFiles
                }
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
