import { Frame } from '@asap-hub/frontend-utils';
import { AuthorResponse, AuthorSelectOption } from '@asap-hub/model';
import {
  ManuscriptForm,
  ManuscriptHeader,
  usePushFromHere,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import {
  useAuthorSuggestions,
  useLabSuggestions,
  useTeamSuggestions,
} from '../../shared-state';
import {
  refreshTeamState,
  useManuscriptById,
  usePostManuscript,
  usePutManuscript,
  useResubmitManuscript,
  useTeamById,
  useUploadManuscriptFile,
} from './state';
import { useEligibilityReason } from './useEligibilityReason';
import { useManuscriptToast } from './useManuscriptToast';

type TeamManuscriptProps = {
  teamId: string;
  resubmitManuscript?: boolean;
};
const TeamManuscript: React.FC<TeamManuscriptProps> = ({
  teamId,
  resubmitManuscript = false,
}) => {
  const setRefreshTeamState = useSetRecoilState(refreshTeamState(teamId));
  const { manuscriptId } = useParams<{ manuscriptId: string }>();
  const manuscript = useManuscriptById(manuscriptId);

  const team = useTeamById(teamId);

  const { eligibilityReasons } = useEligibilityReason();
  const { setFormType } = useManuscriptToast();
  const form = useForm();
  const createManuscript = usePostManuscript();
  const updateManuscript = usePutManuscript();
  const handleResubmitManuscript = useResubmitManuscript();
  const handleFileUpload = useUploadManuscriptFile();
  const getTeamSuggestions = useTeamSuggestions();
  const getLabSuggestions = useLabSuggestions();
  const getAuthorSuggestions = useAuthorSuggestions();

  const pushFromHere = usePushFromHere();

  const onSuccess = () => {
    const path = network({}).teams({}).team({ teamId }).workspace({}).$;
    setFormType('manuscript');
    setRefreshTeamState((value) => value + 1);
    pushFromHere(path);
  };

  const {
    teams: manuscriptTeams,
    labs: manuscriptLabs,
    firstAuthors: manuscriptFirstAuthors,
    correspondingAuthor: manuscriptCorrespondingAuthor,
    additionalAuthors: manuscriptAdditionalAuthors,
    ...manuscriptVersion
  } = manuscript?.versions[0] || {};
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
        <ManuscriptForm
          manuscriptId={manuscriptId}
          onSuccess={onSuccess}
          onCreate={createManuscript}
          onUpdate={updateManuscript}
          onResubmit={handleResubmitManuscript}
          teamId={teamId}
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
          firstAuthors={convertAuthorsToSelectOptions(manuscriptFirstAuthors)}
          correspondingAuthor={convertAuthorsToSelectOptions(
            manuscriptCorrespondingAuthor,
          )}
          additionalAuthors={convertAuthorsToSelectOptions(
            manuscriptAdditionalAuthors,
          )}
          resubmitManuscript={resubmitManuscript}
          {...manuscriptVersion}
        />
      </Frame>
    </FormProvider>
  );
};

export default TeamManuscript;
