import {
  ApcCoverageOption,
  AuthorEmailField,
  AuthorSelectOption,
  ManuscriptError,
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptFormData,
  manuscriptFormFieldsMapping,
  ManuscriptLifecycle,
  ManuscriptPostAuthor,
  ManuscriptPostRequest,
  ManuscriptPutRequest,
  ManuscriptResponse,
  ManuscriptType,
  manuscriptTypeLifecycles,
  manuscriptTypes,
  ManuscriptVersion,
  QuestionChecksOption,
  QuickCheck,
  QuickCheckDetails,
  quickCheckQuestions,
} from '@asap-hub/model';
import { isInternalUser } from '@asap-hub/validation';
import { css } from '@emotion/react';
import React, { ComponentProps, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AuthorSelect,
  FormCard,
  LabeledDateField,
  LabeledDropdown,
  LabeledFileField,
  LabeledMultiSelect,
  LabeledRadioButtonGroup,
  LabeledTextArea,
  LabeledTextField,
  ManuscriptAuthors,
} from '..';
import { Button, Link, MultiSelectOptionsType } from '../atoms';
import { defaultPageLayoutPaddingStyle } from '../layout';
import { ManuscriptFormModals } from '../organisms';
import { mobileScreen, rem } from '../pixels';

const MAX_FILE_SIZE = 100_000_000;
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

const apcCoverageLifecycles = [
  'Typeset proof',
  'Publication',
  'Publication with addendum or corrigendum',
];

type OptionalVersionFields = Array<
  keyof Omit<
    ManuscriptVersion,
    | 'id'
    | 'type'
    | 'lifecycle'
    | 'complianceReport'
    | 'count'
    | 'createdBy'
    | 'updatedBy'
    | 'createdDate'
    | 'publishedAt'
    | 'firstAuthors'
    | 'correspondingAuthor'
    | 'additionalAuthors'
    | 'versionUID'
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
  'availabilityStatement',
  'manuscriptLicense',
  'datasetsDeposited',
  'codeDeposited',
  'protocolsDeposited',
  'labMaterialsRegistered',
];

export const getPostAuthors = (
  authorSelectOptions: AuthorSelectOption[] | AuthorSelectOption,
  authorEmailFields: AuthorEmailField[],
): ManuscriptPostAuthor[] => {
  if (
    Array.isArray(authorSelectOptions) &&
    authorSelectOptions.length &&
    Array.isArray(authorEmailFields)
  ) {
    const users = authorSelectOptions.reduce(
      (internalAuthors: { userId: string }[], { value, author }) => {
        if (author && isInternalUser(author)) {
          internalAuthors.push({ userId: value });
        }
        return internalAuthors;
      },
      [],
    );

    const externalUsers = (authorEmailFields || []).map(
      ({ id, name, email }) => ({
        externalAuthorId: id,
        externalAuthorName: name,
        externalAuthorEmail: email,
      }),
    );

    return [...users, ...externalUsers];
  }

  if (
    authorSelectOptions &&
    !Array.isArray(authorSelectOptions) &&
    // eslint-disable-next-line no-underscore-dangle
    authorSelectOptions.author?.__meta.type === 'user'
  ) {
    return [{ userId: authorSelectOptions.value }];
  }

  if (authorEmailFields[0]) {
    return [
      {
        externalAuthorId: authorEmailFields[0].id,
        externalAuthorName: authorEmailFields[0].name,
        externalAuthorEmail: authorEmailFields[0].email,
      },
    ];
  }

  return [];
};

const getQuickCheckDescription = (quickCheck: QuickCheck) => {
  if (quickCheck === 'availabilityStatement') {
    return (
      <>
        Review the{' '}
        <Link href="https://docs.google.com/document/d/1rkAsm9UrElP8OhXCdxQXKxNGWz4HsOAIXrYtfxAn7kI/edit">
          compliance checklist
        </Link>{' '}
        for more information.
      </>
    );
  }

  return null;
};

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
  | 'id'
  | 'type'
  | 'lifecycle'
  | 'manuscriptFile'
  | 'keyResourceTable'
  | 'additionalFiles'
  | 'description'
  | 'count'
  | 'createdBy'
  | 'updatedBy'
  | 'createdDate'
  | 'publishedAt'
  | 'teams'
  | 'labs'
  | 'versionUID'
> &
  Partial<Pick<ManuscriptPostRequest, 'title'>> & {
    type?: ManuscriptVersion['type'] | '';
    lifecycle?: ManuscriptVersion['lifecycle'] | '';
    manuscriptFile?: ManuscriptFileResponse;
    keyResourceTable?: ManuscriptFileResponse;
    additionalFiles?: ManuscriptFileResponse[];
    description?: string | '';
    eligibilityReasons: Set<string>;
    resubmitManuscript?: boolean;
    onCreate: (
      output: ManuscriptPostRequest,
    ) => Promise<ManuscriptResponse | void>;
    onUpdate: (
      id: string,
      output: ManuscriptPutRequest,
    ) => Promise<ManuscriptResponse | void>;
    onResubmit: (
      id: string,
      output: ManuscriptPostRequest,
    ) => Promise<ManuscriptResponse | void>;
    manuscriptId?: string;
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
    selectedLabs: MultiSelectOptionsType[];
    getLabSuggestions?: ComponentProps<
      typeof LabeledMultiSelect
    >['loadOptions'];
    getAuthorSuggestions: NonNullable<
      ComponentProps<typeof AuthorSelect>['loadOptions']
    >;
    firstAuthors?: AuthorSelectOption[];
    correspondingAuthor?: AuthorSelectOption[];
    additionalAuthors?: AuthorSelectOption[];
    onError: (error: ManuscriptError | Error) => void;
    clearFormToast: () => void;
  };

const ManuscriptForm: React.FC<ManuscriptFormProps> = ({
  manuscriptId,
  onCreate,
  onUpdate,
  onResubmit,
  onSuccess,
  onError,
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
  submitterName,
  submissionDate,
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
  availabilityStatement,
  acknowledgedGrantNumberDetails,
  asapAffiliationIncludedDetails,
  manuscriptLicenseDetails,
  datasetsDepositedDetails,
  codeDepositedDetails,
  protocolsDepositedDetails,
  labMaterialsRegisteredDetails,
  availabilityStatementDetails,
  getTeamSuggestions,
  selectedTeams,
  getLabSuggestions,
  selectedLabs,
  getAuthorSuggestions,
  description,
  firstAuthors,
  correspondingAuthor,
  additionalAuthors,
  resubmitManuscript = false,
  clearFormToast,
}) => {
  const [titleServerError, setTitleServerError] = useState<
    string | undefined
  >();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const getDefaultQuickCheckValue = (
    quickCheck: string | undefined,
    quickCheckDetails: string | undefined,
  ) => {
    const isEditing = !!title;

    if (isEditing) {
      return quickCheckDetails ? quickCheck : 'Yes';
    }

    return undefined;
  };

  const isEditMode = !!manuscriptId && !resubmitManuscript;
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
          submitterName: submitterName || undefined,
          submissionDate: submissionDate ? new Date(submissionDate) : undefined,
          publicationDoi: publicationDoi || '',
          otherDetails: otherDetails || '',
          manuscriptFile: manuscriptFile || undefined,
          keyResourceTable: keyResourceTable || undefined,
          additionalFiles: additionalFiles || undefined,

          acknowledgedGrantNumber: getDefaultQuickCheckValue(
            acknowledgedGrantNumber,
            acknowledgedGrantNumberDetails,
          ),
          asapAffiliationIncluded: getDefaultQuickCheckValue(
            asapAffiliationIncluded,
            asapAffiliationIncludedDetails,
          ),
          manuscriptLicense: getDefaultQuickCheckValue(
            manuscriptLicense,
            manuscriptLicenseDetails,
          ),
          datasetsDeposited: getDefaultQuickCheckValue(
            datasetsDeposited,
            datasetsDepositedDetails,
          ),
          codeDeposited: getDefaultQuickCheckValue(
            codeDeposited,
            codeDepositedDetails,
          ),
          protocolsDeposited: getDefaultQuickCheckValue(
            protocolsDeposited,
            protocolsDepositedDetails,
          ),
          labMaterialsRegistered: getDefaultQuickCheckValue(
            labMaterialsRegistered,
            labMaterialsRegisteredDetails,
          ),
          availabilityStatement: getDefaultQuickCheckValue(
            availabilityStatement,
            availabilityStatementDetails,
          ),
          acknowledgedGrantNumberDetails:
            acknowledgedGrantNumberDetails ?? undefined,
          asapAffiliationIncludedDetails:
            asapAffiliationIncludedDetails ?? undefined,
          manuscriptLicenseDetails: manuscriptLicenseDetails ?? undefined,
          datasetsDepositedDetails: datasetsDepositedDetails ?? undefined,
          codeDepositedDetails: codeDepositedDetails ?? undefined,
          protocolsDepositedDetails: protocolsDepositedDetails ?? undefined,
          labMaterialsRegisteredDetails:
            labMaterialsRegisteredDetails ?? undefined,
          availabilityStatementDetails:
            availabilityStatementDetails ?? undefined,
          teams: selectedTeams || [],
          labs: selectedLabs || [],
          description: description || '',
          firstAuthors: firstAuthors || [],
          firstAuthorsEmails: [],
          correspondingAuthor: correspondingAuthor || [],
          correspondingAuthorEmails: [],
          additionalAuthors: additionalAuthors || [],
          additionalAuthorsEmails: [],
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
    getValues,
    watch,
    setValue,
    setError,
    clearErrors,
    reset,
    resetField,
    trigger,
  } = methods;

  const commonManuscriptAuthorProps = {
    control,
    getAuthorSuggestions,
    getValues,
    isSubmitting,
    trigger,
  };

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
              labs: selectedLabs,
              manuscriptFile: watch('versions.0.manuscriptFile'),
              keyResourceTable: watch('versions.0.keyResourceTable'),
              additionalFiles: watch('versions.0.additionalFiles'),
              submissionDate: watch('versions.0.submissionDate'),
              submitterName: watch('versions.0.submitterName'),
            },
          ],
        },
        { keepDefaultValues: true },
      );
    }
    // TODO: when edit remove reset?
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getValues, reset, watchType, watchLifecycle, selectedTeams]);

  const getSubmittingQuickChecks = (
    versionData: ManuscriptFormData['versions'][number],
  ) => {
    const quickChecks = [
      'acknowledgedGrantNumber',
      'asapAffiliationIncluded',
      'availabilityStatement',
      'manuscriptLicense',
      'datasetsDeposited',
      'codeDeposited',
      'protocolsDeposited',
      'labMaterialsRegistered',
    ] as const;

    return quickChecks.reduce(
      (
        result: Record<QuickCheck | QuickCheckDetails, string>,
        quickCheck: QuickCheck,
      ) => {
        const quickCheckValue = versionData?.[quickCheck] || undefined;
        const quickCheckDetails = `${quickCheck}Details` as const;
        const quickCheckDetailsValue = versionData?.[quickCheckDetails];
        return {
          ...result,
          [quickCheck]: quickCheckValue,
          [quickCheckDetails]:
            quickCheckValue &&
            quickCheckDetailsValue &&
            ['No', 'Not applicable'].includes(quickCheckValue)
              ? quickCheckDetailsValue
              : '',
        };
      },
      {} as Record<QuickCheck | QuickCheckDetails, string>,
    );
  };

  const onSubmit = async (data: ManuscriptFormData) => {
    setIsSubmitting(true);

    clearFormToast();
    const versionData = data.versions[0];

    if (versionData?.type && versionData.lifecycle) {
      const {
        firstAuthorsEmails,
        correspondingAuthorEmails,
        additionalAuthorsEmails,
        ...requestVersionData
      } = versionData;

      const versionDataPayload = {
        publicationDoi: versionData?.publicationDoi || undefined,
        preprintDoi: versionData?.preprintDoi || undefined,
        otherDetails: versionData?.otherDetails || undefined,
        requestingApcCoverage: versionData?.requestingApcCoverage || undefined,
        description: versionData.description || '',
        submitterName:
          versionData?.requestingApcCoverage === 'Already submitted' &&
          versionData?.submitterName
            ? versionData.submitterName
            : undefined,
        submissionDate:
          versionData?.requestingApcCoverage === 'Already submitted' &&
          versionData.submissionDate
            ? versionData.submissionDate.toISOString()
            : undefined,

        ...getSubmittingQuickChecks(versionData),
        teams: versionData.teams.map((team) => team.value),
        labs: versionData.labs.map((lab) => lab.value),
        firstAuthors: getPostAuthors(
          versionData.firstAuthors,
          firstAuthorsEmails,
        ),
        correspondingAuthor: getPostAuthors(
          versionData.correspondingAuthor,
          correspondingAuthorEmails,
        )?.[0],
        additionalAuthors: getPostAuthors(
          versionData.additionalAuthors,
          additionalAuthorsEmails,
        ),
      };
      try {
        if (!manuscriptId) {
          await onCreate({
            ...data,
            teamId,
            eligibilityReasons: [...eligibilityReasons],
            versions: [
              {
                ...requestVersionData,
                ...versionDataPayload,
              },
            ],
          });
        } else if (resubmitManuscript) {
          await onResubmit(manuscriptId, {
            title: data.title,
            teamId,
            versions: [
              {
                ...requestVersionData,
                ...versionDataPayload,
              },
            ],
          });
        } else {
          await onUpdate(manuscriptId, {
            title: data.title,
            teamId,
            versions: [
              {
                ...requestVersionData,
                ...versionDataPayload,
              },
            ],
          });
        }
        onSuccess();
      } catch (error) {
        if (
          (error as ManuscriptError).statusCode === 422 &&
          (error as ManuscriptError).response?.message ===
            'Title must be unique'
        ) {
          setTitleServerError(
            'This title is already in use. Please choose a different one.',
          );
        }
        onError(error as ManuscriptError | Error);
      } finally {
        setModal(null);
        setIsSubmitting(false);
      }
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

  const [modal, setModal] = useState<'submit' | 'cancel' | null>(null);
  const handleSubmitConfirmation = () => setModal('submit');
  const handleCancelConfirmation = () => setModal('cancel');

  return (
    <form onSubmit={handleSubmit(handleSubmitConfirmation)}>
      <ManuscriptFormModals
        isSubmitting={isSubmitting}
        modal={modal}
        handleSubmit={handleSubmit(onSubmit)}
        setModal={setModal}
        isEditMode={isEditMode}
      />
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
                  customValidationMessage={titleServerError || error?.message}
                  value={value}
                  onChange={(titleText) => {
                    setTitleServerError(undefined);
                    onChange(titleText);
                  }}
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
                  enabled={!isEditMode && !isSubmitting}
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
                    enabled={!isEditMode && !isSubmitting}
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
                      (watchLifecycle === 'Preprint' ||
                        (resubmitManuscript &&
                          [
                            'Publication',
                            'Publication with addendum or corrigendum',
                          ].includes(watchLifecycle))) &&
                      'Please enter a Preprint DOI',
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Preprint DOI"
                      subtitle={
                        watchLifecycle === 'Preprint' || resubmitManuscript
                          ? '(required)'
                          : '(optional)'
                      }
                      description="Your preprint DOI must start with 10."
                      onChange={onChange}
                      customValidationMessage={error?.message}
                      value={value ?? ''}
                      enabled={!isEditMode && !isSubmitting}
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
                      enabled={!isEditMode && !isSubmitting}
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
                          disabled: isEditMode || isSubmitting,
                        },
                        {
                          value: 'No',
                          label: 'No',
                          disabled: isEditMode || isSubmitting,
                        },
                        {
                          value: 'Already submitted',
                          label: 'Already submitted',
                          disabled: isEditMode || isSubmitting,
                        },
                      ]}
                      value={value || 'Already submitted'}
                      onChange={onChange}
                    />
                  )}
                />
              )}

            {watch('versions.0.requestingApcCoverage') ===
            'Already submitted' ? (
              <>
                <Controller
                  name="versions.0.submitterName"
                  control={control}
                  rules={{
                    required: "Please enter the submitter's name.",
                    maxLength: {
                      value: 256,
                      message: 'The name cannot exceed 256 characters.',
                    },
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Submitter’s Name"
                      subtitle="(required)"
                      customValidationMessage={error?.message}
                      value={value || ''}
                      onChange={onChange}
                      enabled={!isEditMode && !isSubmitting}
                    />
                  )}
                />
                <Controller
                  name="versions.0.submissionDate"
                  control={control}
                  rules={{
                    required: 'Please enter the submission date.',
                  }}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => (
                    <LabeledDateField
                      customValidationMessage={error?.message}
                      title="Submission Date"
                      subtitle="(required)"
                      onChange={onChange}
                      value={value}
                      enabled={!isEditMode && !isSubmitting}
                    />
                  )}
                />
              </>
            ) : null}
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
                      enabled={!isEditMode && !isSubmitting}
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
                    description="The main manuscript must be submitted as a single PDF file and should contain all primary and supplemental text, methods, and figures. The file size must not exceed 100 MB."
                    placeholder="Upload Manuscript File"
                    onRemove={() => {
                      resetField('versions.0.manuscriptFile');
                    }}
                    handleFileUpload={async (file) => {
                      if (file.size > MAX_FILE_SIZE) {
                        setError('versions.0.manuscriptFile', {
                          type: 'custom',
                          message:
                            'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
                        });
                      } else {
                        setIsUploadingManuscriptFile(true);
                        clearErrors('versions.0.manuscriptFile');

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
                    enabled={
                      !isEditMode && !isSubmitting && !isUploadingManuscriptFile
                    }
                    tagEnabled={!isEditMode}
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
                          generated in this study. The file size must not exceed
                          100 MB. View guidance{' '}
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
                            message:
                              'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
                          });
                        } else {
                          setIsUploadingKeyResourceTable(true);
                          clearErrors('versions.0.keyResourceTable');

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
                      enabled={
                        !isEditMode &&
                        !isSubmitting &&
                        !isUploadingKeyResourceTable
                      }
                      tagEnabled={!isEditMode}
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
                    description={
                      <>
                        Additional files must be submitted in PDF and/or CSV
                        formats. The file size must not exceed 100 MB.
                      </>
                    }
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
                            message:
                              'The file size exceeds the limit of 100 MB. Please upload a smaller file.',
                          });
                        } else {
                          setIsUploadingAdditionalFiles(true);
                          clearErrors('versions.0.additionalFiles');

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
                    enabled={
                      !isEditMode &&
                      !isSubmitting &&
                      !isUploadingAdditionalFiles
                    }
                    tagEnabled={!isEditMode}
                  />
                )}
              />
            )}
            <Controller
              name="versions.0.description"
              control={control}
              rules={{
                required: 'Please enter the description.',
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <LabeledTextArea
                  title="Manuscript Description"
                  subtitle="(required)"
                  tip={
                    <span>
                      Please provide a description of the outcomes of your paper
                      and how it relates to your ASAP project (view example{' '}
                      <Link href="https://docs.google.com/document/d/1dU8VLqKjyJM_tBNWpxAAJyoALknQgbRlKm5PdqopFUM/edit">
                        here
                      </Link>
                      ).
                    </span>
                  }
                  customValidationMessage={error?.message}
                  value={value || ''}
                  onChange={onChange}
                  enabled={!isSubmitting}
                />
              )}
            />
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

            <ManuscriptAuthors
              isMultiSelect
              isRequired
              fieldName="firstAuthors"
              fieldTitle="First Author Full Name"
              fieldDescription="Add the name of the first author(s). First authors will receive updates. First authors who are active on the CRN Hub will be able to edit the manuscript metadata and can submit a new version of the manuscript."
              fieldEmailDescription="Provide a valid email address for the Non-CRN first author."
              {...commonManuscriptAuthorProps}
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

            <ManuscriptAuthors
              fieldName="correspondingAuthor"
              fieldTitle="Corresponding Author"
              fieldDescription="Add the corresponding author. The corresponding author will receive updates. Corresponding Author who are active on the CRN Hub will be able to edit the manuscript metadata and can submit a new version of the manuscript."
              fieldEmailDescription="Provide a valid email address for the Non-CRN corresponding author."
              {...commonManuscriptAuthorProps}
            />

            <ManuscriptAuthors
              isMultiSelect
              fieldName="additionalAuthors"
              fieldTitle="Additional Authors"
              fieldDescription="Add the names of any additional authors who should receive updates. These additional authors, who are active on the CRN Hub, will be able to edit the manuscript metadata and can submit a new version of the manuscript."
              fieldEmailDescription="Provide a valid email address for the Non-CRN additional author."
              {...commonManuscriptAuthorProps}
            />
          </FormCard>

          {watchType && watchLifecycle && (
            <FormCard
              key="quick-checks"
              title="Quick Checks"
              description="Before you submit your manuscript, please confirm that you have met the following requirements."
            >
              <div
                css={css({
                  display: 'flex',
                  flexDirection: 'column',
                  gap: rem(48),
                  paddingTop: rem(8),
                  paddingBottom: rem(8),
                })}
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
                              testId={field}
                              title={question}
                              subtitle="(required)"
                              description={getQuickCheckDescription(field)}
                              options={[
                                {
                                  value: 'Yes',
                                  label: 'Yes',
                                  disabled: isEditMode || isSubmitting,
                                },
                                {
                                  value: 'No',
                                  label: 'No',
                                  disabled: isEditMode || isSubmitting,
                                },
                                {
                                  value: 'Not applicable',
                                  label: 'Not applicable',
                                  disabled: isEditMode || isSubmitting,
                                },
                              ]}
                              value={value as QuestionChecksOption}
                              onChange={onChange}
                              validationMessage={error?.message ?? ''}
                            />
                          )}
                        />
                        {['No', 'Not applicable'].includes(
                          watch(`versions.0.${field}`) as string,
                        ) && (
                          <div
                            css={css({
                              marginTop: rem(12),
                            })}
                          >
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
                                  noPadding
                                  title="Please provide details"
                                  subtitle="(required)"
                                  description="The reason you provide must be accepted by the Open Science team."
                                  value={value || ''}
                                  customValidationMessage={error?.message}
                                  onChange={onChange}
                                  enabled={!isEditMode && !isSubmitting}
                                />
                              )}
                            />
                          </div>
                        )}
                      </div>
                    ),
                )}
              </div>
            </FormCard>
          )}
          <div css={buttonsOuterContainerStyles}>
            <div css={buttonsInnerContainerStyles}>
              <Button
                noMargin
                enabled={!isSubmitting}
                onClick={handleCancelConfirmation}
              >
                Cancel
              </Button>
              <Button
                primary
                noMargin
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
