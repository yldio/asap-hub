import {
  AuthorEmailField,
  AuthorSelectOption,
  ManuscriptError,
  ManuscriptFileResponse,
  ManuscriptFileType,
  ManuscriptFormData,
  manuscriptFormFieldsMapping,
  ManuscriptLifecycle,
  manuscriptLifecycleRequiredURL,
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
import { isInternalUser, urlExpression } from '@asap-hub/validation';
import { css } from '@emotion/react';
import React, { ComponentProps, useCallback, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  AuthorSelect,
  colors,
  ExternalLinkIcon,
  FormCard,
  GlobeIcon,
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
import { ManuscriptFormModals, ShortDescriptionCard } from '../organisms';
import { mobileScreen, rem } from '../pixels';

const BIG_SPACE = '\u2004';

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

type LabOption = MultiSelectOptionsType & {
  labPITeamIds: string[];
};

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

const setDefaultFieldValues = (fieldsList: OptionalVersionFields) => {
  const fieldDefaultValueMap = fieldsList.reduce(
    (map, field) => ({ ...map, [field]: '' }),
    {} as DefaultFieldValueMapping,
  );

  return fieldDefaultValueMap;
};

const FixMarginWrapper = ({ children }: { children: React.ReactNode }) => (
  <div css={{ marginTop: rem(18), marginBottom: rem(18) }}>{children}</div>
);

type ManuscriptFormProps = Omit<
  ManuscriptVersion,
  | 'id'
  | 'type'
  | 'lifecycle'
  | 'manuscriptFile'
  | 'keyResourceTable'
  | 'additionalFiles'
  | 'description'
  | 'shortDescription'
  | 'count'
  | 'createdBy'
  | 'updatedBy'
  | 'createdDate'
  | 'publishedAt'
  | 'teams'
  | 'labs'
  | 'versionUID'
> &
  Partial<Pick<ManuscriptPostRequest, 'title' | 'url'>> & {
    isOpenScienceTeamMember?: boolean;
    type?: ManuscriptVersion['type'] | '';
    lifecycle?: ManuscriptVersion['lifecycle'] | '';
    manuscriptFile?: ManuscriptFileResponse;
    keyResourceTable?: ManuscriptFileResponse;
    additionalFiles?: ManuscriptFileResponse[];
    description?: string | '';
    shortDescription?: string | '';
    eligibilityReasons: Set<string>;
    resubmitManuscript?: boolean;
    getShortDescriptionFromDescription: (
      descriptionMD: string,
    ) => Promise<string>;
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
    getImpactSuggestions: NonNullable<
      ComponentProps<typeof LabeledMultiSelect>['loadOptions']
    >;
    getCategorySuggestions: NonNullable<
      ComponentProps<typeof LabeledMultiSelect>['loadOptions']
    >;
    impact: MultiSelectOptionsType;
    categories: MultiSelectOptionsType[];
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
  isOpenScienceTeamMember = false,
  title,
  url,
  impact,
  categories,
  type,
  lifecycle,
  manuscriptFile,
  keyResourceTable,
  additionalFiles,
  eligibilityReasons,
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
  shortDescription,
  firstAuthors,
  correspondingAuthor,
  additionalAuthors,
  resubmitManuscript = false,
  clearFormToast,
  getShortDescriptionFromDescription,
  getImpactSuggestions,
  getCategorySuggestions,
}) => {
  const usersWithoutTeamAdded = new Set();
  const firstAuthorsWithoutTeamAdded = new Set();
  const correspondingAuthorWithoutTeamAdded = new Set();
  const additionalAuthorsWithoutTeamAdded = new Set();
  const labsWithoutTeamAdded = new Set();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const getDefaultQuickCheckValue = (
    quickCheck: string | undefined,
    quickCheckDetails: string | undefined,
  ) => {
    const isEditing = !!title;

    if (isEditing && !resubmitManuscript) {
      return quickCheckDetails ? quickCheck : 'Yes';
    }

    return undefined;
  };

  const isEditMode = !!manuscriptId && !resubmitManuscript;

  const methods = useForm<ManuscriptFormData>({
    mode: 'all',
    defaultValues: {
      title: title || '',
      url: url || undefined,
      impact: impact || undefined,
      categories: categories || [],
      versions: [
        {
          type: type || '',
          lifecycle: resubmitManuscript ? undefined : lifecycle || '',
          preprintDoi: preprintDoi || '',
          publicationDoi: publicationDoi || '',
          otherDetails: otherDetails || '',
          manuscriptFile: resubmitManuscript ? undefined : manuscriptFile,
          keyResourceTable: resubmitManuscript ? undefined : keyResourceTable,
          additionalFiles: resubmitManuscript ? undefined : additionalFiles,

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
          acknowledgedGrantNumberDetails: resubmitManuscript
            ? undefined
            : acknowledgedGrantNumberDetails ?? undefined,
          asapAffiliationIncludedDetails: resubmitManuscript
            ? undefined
            : asapAffiliationIncludedDetails ?? undefined,
          manuscriptLicenseDetails: resubmitManuscript
            ? undefined
            : manuscriptLicenseDetails ?? undefined,
          datasetsDepositedDetails: resubmitManuscript
            ? undefined
            : datasetsDepositedDetails ?? undefined,
          codeDepositedDetails: resubmitManuscript
            ? undefined
            : codeDepositedDetails ?? undefined,
          protocolsDepositedDetails: resubmitManuscript
            ? undefined
            : protocolsDepositedDetails ?? undefined,
          labMaterialsRegisteredDetails: resubmitManuscript
            ? undefined
            : labMaterialsRegisteredDetails ?? undefined,
          availabilityStatementDetails: resubmitManuscript
            ? undefined
            : availabilityStatementDetails ?? undefined,
          teams: selectedTeams || [],
          labs: selectedLabs || [],
          description: description || '',
          shortDescription: shortDescription || '',
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
    resetField,
    trigger,
    formState,
  } = methods;

  const { isValid, errors } = formState;
  const watchType = watch('versions.0.type');
  const watchLifecycle = watch('versions.0.lifecycle');

  type AllowedVersionFields = `versions.0.${OptionalVersionFields[number]}`;

  const updateOptionalFields = useCallback(
    (manuscriptType: string, lifecycleField: string) => {
      if (!manuscriptType || !lifecycleField) return;

      const fieldsToReset = getFieldsToReset(
        optionalVersionFields,
        manuscriptType as ManuscriptType,
        lifecycleField as ManuscriptLifecycle,
      );
      const fieldDefaultValueMap = setDefaultFieldValues(fieldsToReset);

      // Instead of full form reset, selectively update fields
      Object.entries(fieldDefaultValueMap).forEach(([field, value]) => {
        setValue(`versions.0.${field}` as AllowedVersionFields, value, {
          shouldValidate: false,
        });
      });

      // Keep important values that shouldn't be reset
      setValue('versions.0.teams', selectedTeams, { shouldValidate: false });
      setValue('versions.0.labs', selectedLabs, { shouldValidate: false });
    },
    [setValue, selectedTeams, selectedLabs],
  );

  const validateLabPiTeams = () => {
    const labs = watch('versions.0.labs');
    const teams = watch('versions.0.teams');

    const teamFormIds = teams.map((team) => team.value);

    labsWithoutTeamAdded.clear();

    labs
      .filter((lab) => {
        const { labPITeamIds } = lab as LabOption;
        return (
          labPITeamIds?.length > 0 &&
          labPITeamIds.every(
            (labPITeamId) => !teamFormIds.includes(labPITeamId),
          )
        );
      })
      .forEach((lab) => {
        labsWithoutTeamAdded.add(lab.label);
      });

    if (labsWithoutTeamAdded.size > 0) {
      const labErrorMessage = `The following lab(s) do not have the correspondent PI's team listed as a contributor. At least one of the teams they belong to must be added to the teams section above.\n${Array.from(
        labsWithoutTeamAdded,
      )
        .map((lab) => `${BIG_SPACE}•${BIG_SPACE}${lab}`)
        .join('\n')}`;

      setError('versions.0.labs', {
        message: labErrorMessage,
      });
    } else {
      clearErrors('versions.0.labs');
    }
  };

  const validateFirstAuthors = () => {
    const firstAuthorsValues = watch('versions.0.firstAuthors');
    const teamsValues = watch('versions.0.teams');
    const teamFormIds = teamsValues.map((team) => team.value);

    firstAuthorsWithoutTeamAdded.clear();

    firstAuthorsValues
      .filter((algoliaAuthor) => {
        if (
          'author' in algoliaAuthor &&
          algoliaAuthor.author &&
          'teams' in algoliaAuthor.author
        ) {
          return (
            algoliaAuthor.author.teams.length > 0 &&
            algoliaAuthor.author.teams.every(
              (team) => !teamFormIds.includes(team.id),
            )
          );
        }
        return false;
      })
      .forEach((author) => {
        firstAuthorsWithoutTeamAdded.add(author.label);
        usersWithoutTeamAdded.add(author.label);
      });

    if (firstAuthorsWithoutTeamAdded.size > 0) {
      setError('versions.0.firstAuthors', {
        message: `The following first author(s) do not have a team listed as a contributor. At least one of the teams they belong to must be added to the teams section above.\n${Array.from(
          firstAuthorsWithoutTeamAdded,
        )
          .map((author) => `${BIG_SPACE}•${BIG_SPACE}${author}`)
          .join('\n')}`,
      });
    } else {
      clearErrors('versions.0.firstAuthors');
    }
  };

  const validateCorrespondingAuthor = () => {
    const correspondingAuthorValue = watch(
      'versions.0.correspondingAuthor',
    ) as unknown as AuthorSelectOption;
    const teams = watch('versions.0.teams');
    const teamFormIds = teams.map((team) => team.value);

    correspondingAuthorWithoutTeamAdded.clear();

    if (
      correspondingAuthorValue &&
      'author' in correspondingAuthorValue &&
      correspondingAuthorValue.author &&
      'teams' in correspondingAuthorValue.author &&
      correspondingAuthorValue.author.teams.length > 0 &&
      correspondingAuthorValue.author.teams.every(
        (team) => !teamFormIds.includes(team.id),
      )
    ) {
      correspondingAuthorWithoutTeamAdded.add(correspondingAuthorValue.label);
      usersWithoutTeamAdded.add(correspondingAuthorValue.label);
    }

    if (correspondingAuthorWithoutTeamAdded.size > 0) {
      setError('versions.0.correspondingAuthor', {
        message: `The following corresponding author(s) do not have a team listed as a contributor. At least one of the teams they belong to must be added to the teams section above.\n${Array.from(
          correspondingAuthorWithoutTeamAdded,
        )
          .map((author) => `${BIG_SPACE}•${BIG_SPACE}${author}`)
          .join('\n')}`,
      });
    } else {
      clearErrors('versions.0.correspondingAuthor');
    }
  };

  const validateAdditionalAuthors = () => {
    const additionalAuthorsValues = watch('versions.0.additionalAuthors');
    const teams = watch('versions.0.teams');
    const teamFormIds = teams.map((team) => team.value);

    additionalAuthorsWithoutTeamAdded.clear();
    additionalAuthorsValues
      .filter((algoliaAuthor) => {
        if (
          'author' in algoliaAuthor &&
          algoliaAuthor.author &&
          'teams' in algoliaAuthor.author
        ) {
          return (
            algoliaAuthor.author.teams.length > 0 &&
            algoliaAuthor.author.teams.every(
              (team) => !teamFormIds.includes(team.id),
            )
          );
        }
        return false;
      })
      .forEach((author) => {
        additionalAuthorsWithoutTeamAdded.add(author.label);
        usersWithoutTeamAdded.add(author.label);
      });

    if (additionalAuthorsWithoutTeamAdded.size > 0) {
      setError('versions.0.additionalAuthors', {
        message: `The following additional author(s) do not have a team listed as a contributor. At least one of the teams they belong to must be added to the teams section above.\n${Array.from(
          additionalAuthorsWithoutTeamAdded,
        )
          .map((author) => `${BIG_SPACE}•${BIG_SPACE}${author}`)
          .join('\n')}`,
      });
    } else {
      clearErrors('versions.0.additionalAuthors');
    }
  };

  const validateTeams = () => {
    usersWithoutTeamAdded.clear();
    validateFirstAuthors();
    validateCorrespondingAuthor();
    validateAdditionalAuthors();
    validateLabPiTeams();

    const contributorsErrorMessage = `The following contributor(s) do not have a team listed above. At least one of the teams they belong to must be added.\n${Array.from(
      usersWithoutTeamAdded,
    )
      .map((author) => `${BIG_SPACE}•${BIG_SPACE}${author}`)
      .join('\n')}`;

    const labErrorMessage = `The following lab(s) do not have the correspondent PI's team listed as contributors. At least one of the teams the PI belongs to must be added.\n${Array.from(
      labsWithoutTeamAdded,
    )
      .map((lab) => `${BIG_SPACE}•${BIG_SPACE}${lab}`)
      .join('\n')}`;

    if (usersWithoutTeamAdded.size === 0 && labsWithoutTeamAdded.size === 0) {
      clearErrors('versions.0.teams');
    } else if (
      usersWithoutTeamAdded.size > 0 &&
      labsWithoutTeamAdded.size > 0
    ) {
      setError('versions.0.teams', {
        message: `${contributorsErrorMessage}\n\n${labErrorMessage}`,
      });
    } else if (usersWithoutTeamAdded.size > 0) {
      setError('versions.0.teams', {
        message: contributorsErrorMessage,
      });
    } else if (labsWithoutTeamAdded.size > 0) {
      setError('versions.0.teams', { message: labErrorMessage });
    }
  };

  const commonManuscriptAuthorProps = {
    control,
    getAuthorSuggestions,
    getValues,
    isSubmitting,
    trigger,
    validate: validateTeams,
  };

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
        description: versionData.description || '',

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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        manuscriptFile: versionData.manuscriptFile!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        keyResourceTable: versionData.keyResourceTable!,
      };
      try {
        const urlValue = data.url || undefined;
        if (!manuscriptId) {
          await onCreate({
            ...data,
            url: urlValue,
            impact: data.impact?.value,
            categories:
              data.categories?.map((category) => category.value) || [],
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
            url: urlValue,
            impact: data.impact?.value,
            categories:
              data.categories?.map((category) => category.value) || [],
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
            url: urlValue,
            impact: data.impact?.value,
            categories:
              data.categories?.map((category) => category.value) || [],
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
          const { team, manuscriptId: id } = (error as ManuscriptError).response
            ?.data as {
            team: string;
            manuscriptId: string;
          };
          setError('title', {
            message: `A manuscript with this title has already been submitted for Team ${team} (${id}). Please use the edit or resubmission button to update this manuscript.`,
          });
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

  const isURLRequired =
    watchLifecycle &&
    manuscriptLifecycleRequiredURL.includes(
      watchLifecycle as ManuscriptLifecycle,
    );

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
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <LabeledTextField
                  title="Title of Manuscript"
                  subtitle="(required)"
                  customValidationMessage={error?.message}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  enabled={!isSubmitting}
                />
              )}
            />

            <Controller
              name="url"
              control={control}
              rules={{
                required: isURLRequired ? 'Please enter a URL.' : false,
                pattern: {
                  value: new RegExp(urlExpression),
                  message: 'Please enter a valid URL, starting with http://',
                },
              }}
              render={({
                field: { value, onChange, onBlur },
                fieldState: { error },
              }) => (
                <FixMarginWrapper>
                  <LabeledTextField
                    title="URL"
                    subtitle={isURLRequired ? '(required)' : '(optional)'}
                    value={value ?? ''}
                    onChange={onChange}
                    onBlur={onBlur}
                    enabled={!isSubmitting}
                    customValidationMessage={error?.message}
                    labelIndicator={<GlobeIcon />}
                    placeholder="https://example.com"
                  />
                </FixMarginWrapper>
              )}
            />

            <Controller
              name="versions.0.type"
              control={control}
              rules={{
                required: 'Please select a type.',
              }}
              render={({
                field: { value, onChange, onBlur },
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
                  onChange={(e) => {
                    onChange(e);
                    // Clear lifecycle when type changes to prevent mismatched states
                    setValue('versions.0.lifecycle', '');
                  }}
                  onBlur={onBlur}
                  customValidationMessage={error?.message}
                  value={value}
                  enabled={
                    (!isEditMode || isOpenScienceTeamMember) && !isSubmitting
                  }
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
                  field: { value, onChange, onBlur },
                  fieldState: { error },
                }) => (
                  <LabeledDropdown<ManuscriptLifecycle | ''>
                    title="Where is the manuscript in the life cycle?"
                    subtitle="(required)"
                    description="Select the option that matches your manuscript the best."
                    options={lifecycleSuggestions}
                    onChange={async (lifecycleEvent) => {
                      onChange(lifecycleEvent);

                      // Update optional fields based on new selections
                      if (watchType && lifecycleEvent) {
                        updateOptionalFields(
                          watchType as ManuscriptType,
                          lifecycleEvent as ManuscriptLifecycle,
                        );
                      }
                    }}
                    onBlur={onBlur}
                    customValidationMessage={error?.message}
                    value={value}
                    enabled={
                      (!isEditMode || isOpenScienceTeamMember) && !isSubmitting
                    }
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
                      watchLifecycle === 'Preprint' &&
                      'Please enter a Preprint DOI',
                  }}
                  render={({
                    field: { value, onChange, onBlur },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Preprint DOI"
                      subtitle={
                        watchLifecycle === 'Preprint'
                          ? '(required)'
                          : '(optional)'
                      }
                      description="Your preprint DOI must start with 10."
                      onChange={onChange}
                      onBlur={onBlur}
                      customValidationMessage={error?.message}
                      value={value ?? ''}
                      enabled={
                        (!isEditMode || isOpenScienceTeamMember) &&
                        !isSubmitting
                      }
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
                    field: { value, onChange, onBlur },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Publication DOI"
                      subtitle={'(required)'}
                      description="Your publication DOI must start with 10."
                      onChange={onChange}
                      onBlur={onBlur}
                      customValidationMessage={error?.message}
                      value={value ?? ''}
                      enabled={
                        (!isEditMode || isOpenScienceTeamMember) &&
                        !isSubmitting
                      }
                      placeholder="e.g. 10.5555/YFRU1371"
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
                    field: { value, onChange, onBlur },
                    fieldState: { error },
                  }) => (
                    <LabeledTextField
                      title="Please provide details"
                      subtitle={'(required)'}
                      onChange={onChange}
                      onBlur={onBlur}
                      customValidationMessage={error?.message}
                      value={value ?? ''}
                      enabled={
                        (!isEditMode || isOpenScienceTeamMember) &&
                        !isSubmitting
                      }
                    />
                  )}
                />
              )}
            <div
              css={css({
                marginTop: rem(12),
              })}
            >
              <Controller
                name="impact"
                control={control}
                rules={{
                  required: 'Please add at least one impact.',
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <LabeledMultiSelect
                    title="Impact"
                    description="Select the option that best describes the impact of this manuscript on the PD field."
                    subtitle="(required)"
                    placeholder="Start typing..."
                    loadOptions={getImpactSuggestions}
                    isMulti={false}
                    onChange={(selectedOptions) => {
                      onChange(selectedOptions);
                      validateTeams();
                    }}
                    customValidationMessage={error?.message}
                    values={value}
                    noOptionsMessage={({ inputValue }) =>
                      `Sorry, no impacts match ${inputValue}`
                    }
                    enabled={
                      (!isEditMode || isOpenScienceTeamMember) &&
                      !isSubmitting
                    }
                  />
                )}
              />
            </div>

            <div
              css={css({
                marginTop: rem(12),
              })}
            >
              <Controller
                name="categories"
                control={control}
                rules={{
                  required: 'Please add at least one category.',
                  validate: (value) => {
                    if (!value || value.length === 0) {
                      return 'Please add at least one category.';
                    }
                    if (value.length > 2) {
                      return 'You can select up to two categories only.';
                    }
                    return true;
                  },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => (
                  <LabeledMultiSelect
                    title="Category"
                    description="Select up to two options that best describe the scientific category of this manuscript."
                    subtitle="(required)"
                    placeholder="Start typing..."
                    loadOptions={getCategorySuggestions}
                    isMulti={true}
                    onChange={(selectedOptions) => {
                      onChange(selectedOptions);
                      validateTeams();
                    }}
                    customValidationMessage={error?.message}
                    values={value}
                    noOptionsMessage={({ inputValue }) =>
                      `Sorry, no categories match ${inputValue}`
                    }
                    enabled={
                      (!isEditMode || isOpenScienceTeamMember) &&
                      !isSubmitting
                    }
                  />
                )}
              />
            </div>

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
                    onRemove={async () => {
                      resetField('versions.0.manuscriptFile', {
                        defaultValue: null,
                      });
                      await trigger('versions.0.manuscriptFile');
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
                    currentFiles={value ? [value] : []}
                    accept="application/pdf"
                    customValidationMessage={error?.message}
                    enabled={
                      (!isEditMode || isOpenScienceTeamMember) &&
                      !isSubmitting &&
                      !isUploadingManuscriptFile
                    }
                    tagEnabled={!isEditMode || isOpenScienceTeamMember}
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
                      onRemove={async () => {
                        resetField('versions.0.keyResourceTable', {
                          defaultValue: null,
                        });
                        await trigger('versions.0.keyResourceTable');
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
                      currentFiles={value ? [value] : []}
                      accept="text/csv"
                      customValidationMessage={error?.message}
                      enabled={
                        (!isEditMode || isOpenScienceTeamMember) &&
                        !isSubmitting &&
                        !isUploadingKeyResourceTable
                      }
                      tagEnabled={!isEditMode || isOpenScienceTeamMember}
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
                      (!isEditMode || isOpenScienceTeamMember) &&
                      !isSubmitting &&
                      !isUploadingAdditionalFiles
                    }
                    tagEnabled={!isEditMode || isOpenScienceTeamMember}
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
                field: { value, onChange, onBlur },
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
                  onBlur={onBlur}
                  enabled={!isSubmitting}
                />
              )}
            />

            <Controller
              name="versions.0.shortDescription"
              control={control}
              rules={{
                required: 'Please enter the short description.',
                maxLength: {
                  value: 250,
                  message:
                    'The short description exceeds the character limit. Please limit it to 250 characters.',
                },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <ShortDescriptionCard
                  buttonEnabled={!!watch('versions.0.description')}
                  enabled={!isSubmitting}
                  onChange={async (e) => {
                    onChange(e);
                    await trigger('versions.0.shortDescription');
                  }}
                  value={value}
                  customValidationMessage={error?.message}
                  tip="Use AI to generate a short description or write your own based on the description field above."
                  getShortDescription={() =>
                    getShortDescriptionFromDescription(
                      watch('versions.0.description'),
                    )
                  }
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
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <LabeledMultiSelect
                  title="Teams"
                  description="Add other teams that contributed to this manuscript. The Project Manager and Lead PI from all teams listed will receive updates. They will also be able to edit the manuscript metadata and submit a new version of the manuscript."
                  subtitle="(required)"
                  enabled={!isSubmitting}
                  placeholder="Start typing..."
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  loadOptions={getTeamSuggestions!}
                  onChange={(selectedOptions) => {
                    onChange(selectedOptions);
                    validateTeams();
                  }}
                  customValidationMessage={error?.message}
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
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <LabeledMultiSelect
                  title="Labs"
                  description="Add ASAP labs that contributed to this manuscript. Only labs whose PI is part of the CRN will appear. PIs for each listed lab will receive an update on this manuscript. In addition, they will be able to edit the manuscript metadata and can submit a new version of the manuscript."
                  subtitle="(optional)"
                  enabled={!isSubmitting}
                  placeholder="Start typing..."
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  loadOptions={getLabSuggestions!}
                  onChange={(selectedOptions) => {
                    onChange(selectedOptions);
                    validateTeams();
                  }}
                  values={value}
                  noOptionsMessage={({ inputValue }) =>
                    `Sorry, no labs match ${inputValue}`
                  }
                  customValidationMessage={error?.message}
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
              description={
                <p>
                  Before you submit your manuscript, please confirm that you
                  have met the following requirements. For a more detailed
                  explanation, please refer to the&nbsp;
                  <Link href="https://docs.google.com/document/d/1rkAsm9UrElP8OhXCdxQXKxNGWz4HsOAIXrYtfxAn7kI">
                    <span
                      css={css({
                        wordBreak: 'break-word',
                        position: 'relative',
                        '& svg': {
                          position: 'absolute',
                          bottom: '1px',
                        },
                      })}
                    >
                      Open Science Compliance Checklist for Authors
                      <ExternalLinkIcon size={17} color={colors.pine} />
                    </span>
                  </Link>
                </p>
              }
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
                                maxLength: {
                                  value: 256,
                                  message:
                                    'Reason cannot exceed 256 characters.',
                                },
                              }}
                              render={({
                                field: { value, onChange, onBlur },
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
                                  onBlur={onBlur}
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
                  isValid &&
                  Object.keys(errors).length === 0 &&
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
