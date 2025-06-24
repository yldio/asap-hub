import React, { lazy, Suspense } from 'react';
import { Frame } from '@asap-hub/frontend-utils';
import {
  AuthorResponse,
  AuthorSelectOption,
  ManuscriptError,
} from '@asap-hub/model';
import { useCurrentUserCRN } from '@asap-hub/react-context';
import { ManuscriptHeader, usePushFromHere } from '@asap-hub/react-components';
import { ManuscriptForm as ManuscriptFormSync } from '@asap-hub/react-components/manuscript-form';
import { network } from '@asap-hub/routing';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  useGeneratedContent,
  useTeamSuggestions,
  useImpactSuggestions,
} from '../../shared-state';
import {
  refreshTeamState,
  useManuscriptById,
  usePostManuscript,
  usePutManuscript,
  useResubmitManuscript,
  useTeamById,
  useUploadManuscriptFileViaPresignedUrl,
} from './state';
import { useEligibilityReason } from './useEligibilityReason';
import { useManuscriptToast } from './useManuscriptToast';
import { useCategorySuggestions } from '../../shared-state/category';

const ManuscriptFormLazy = lazy(() =>
  import('@asap-hub/react-components/manuscript-form').then((module) => ({
    default: module.ManuscriptForm,
  })),
);

const ManuscriptForm =
  process.env.NODE_ENV === 'test' ? ManuscriptFormSync : ManuscriptFormLazy;

type TeamManuscriptProps = {
  teamId: string;
  resubmitManuscript?: boolean;
};

const WithSuspense: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) =>
  process.env.NODE_ENV === 'test' ? (
    <>{children}</>
  ) : (
    <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
  );

const TeamManuscript: React.FC<TeamManuscriptProps> = ({
  teamId,
  resubmitManuscript = false,
}) => {
  const setRefreshTeamState = useSetRecoilState(refreshTeamState(teamId));
  const { manuscriptId } = useParams<{ manuscriptId: string }>();
  const [manuscript] = useManuscriptById(manuscriptId);

  const team = useTeamById(teamId);
  const user = useCurrentUserCRN();

  const { eligibilityReasons } = useEligibilityReason();
  const { setFormType } = useManuscriptToast();
  const form = useForm();
  const createManuscript = usePostManuscript();
  const updateManuscript = usePutManuscript();
  const handleResubmitManuscript = useResubmitManuscript();
  const handleFileUpload = useUploadManuscriptFileViaPresignedUrl();
  const getTeamSuggestions = useTeamSuggestions();
  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();
  const getShortDescriptionFromDescription = useGeneratedContent();
  const getImpactSuggestions = useImpactSuggestions();
  const getCategorySuggestions = useCategorySuggestions();

  const pushFromHere = usePushFromHere();

  const onSuccess = () => {
    const path = network({}).teams({}).team({ teamId }).workspace({}).$;
    setFormType({ type: 'manuscript', accent: 'successLarge' });
    setRefreshTeamState((value) => value + 1);
    pushFromHere(path);
  };

  const onError = (error: ManuscriptError | Error) => {
    if ('statusCode' in error && error.statusCode === 422) {
      setFormType({ type: 'server-validation-error', accent: 'error' });
    } else {
      setFormType({ type: 'default-error', accent: 'error' });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const {
    teams: manuscriptTeams,
    labs: manuscriptLabs,
    firstAuthors: manuscriptFirstAuthors,
    correspondingAuthor: manuscriptCorrespondingAuthor,
    additionalAuthors: manuscriptAdditionalAuthors,
    ...manuscriptVersion
  } = manuscript?.versions[0] || {};

  const { impact: manuscriptImpact, categories: manuscriptCategories } =
    manuscript || {};
  const selectedImpact = manuscriptImpact
    ? { value: manuscriptImpact.id, label: manuscriptImpact.name }
    : { value: '', label: '' };

  const selectedCategories = (manuscriptCategories || [])?.map((category) => ({
    value: category.id,
    label: category.name,
  }));

  const selectedTeams = manuscriptTeams?.map((selectedTeam, index) => ({
    value: selectedTeam.id,
    label: selectedTeam.displayName,
    isFixed: index === 0,
  })) || [
    {
      value: teamId,
      label: team?.displayName || '',
      isFixed: true,
    },
  ];

  const selectedLabs = (manuscriptLabs || []).map((lab) => ({
    value: lab.id,
    label: lab.name,
    labPITeamIds: lab.labPITeamIds,
    isFixed: false,
  }));

  const convertAuthorsToSelectOptions = (
    authors: AuthorResponse[] | undefined,
  ) =>
    (authors || []).map((author) => ({
      author,
      label: author.displayName,
      value: author.id,
    })) as (AuthorResponse & AuthorSelectOption)[];

  return (
    <FormProvider {...form}>
      <Frame title="Create Manuscript">
        <ManuscriptHeader resubmitManuscript={resubmitManuscript} />
        <WithSuspense>
          <ManuscriptForm
            getShortDescriptionFromDescription={
              getShortDescriptionFromDescription
            }
            manuscriptId={manuscriptId}
            onSuccess={onSuccess}
            onCreate={createManuscript}
            onError={onError}
            onUpdate={updateManuscript}
            onResubmit={handleResubmitManuscript}
            teamId={teamId}
            isOpenScienceTeamMember={user?.openScienceTeamMember}
            handleFileUpload={handleFileUpload}
            eligibilityReasons={eligibilityReasons}
            getTeamSuggestions={getTeamSuggestions}
            selectedTeams={selectedTeams}
            getLabSuggestions={getLabSuggestions}
            selectedLabs={selectedLabs}
            getAuthorSuggestions={(input) =>
              getAuthorSuggestions(input).then((authors) =>
                authors.map((author) => ({
                  author,
                  label: author.displayName,
                  value: author.id,
                })),
              )
            }
            title={manuscript?.title}
            url={manuscript?.url}
            impact={selectedImpact}
            categories={selectedCategories}
            firstAuthors={convertAuthorsToSelectOptions(manuscriptFirstAuthors)}
            correspondingAuthor={convertAuthorsToSelectOptions(
              manuscriptCorrespondingAuthor,
            )}
            additionalAuthors={convertAuthorsToSelectOptions(
              manuscriptAdditionalAuthors,
            )}
            resubmitManuscript={resubmitManuscript}
            clearFormToast={() => {
              setFormType({ type: '', accent: 'successLarge' });
            }}
            getImpactSuggestions={getImpactSuggestions}
            getCategorySuggestions={getCategorySuggestions}
            {...manuscriptVersion}
          />
        </WithSuspense>
      </Frame>
    </FormProvider>
  );
};

export default TeamManuscript;
