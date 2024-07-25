import { Frame } from '@asap-hub/frontend-utils';
import {
  ManuscriptForm,
  ManuscriptHeader,
  usePushFromHere,
} from '@asap-hub/react-components';
import { networkRoutes } from '@asap-hub/routing';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { useLabSuggestions, useTeamSuggestions } from '../../shared-state';
import {
  refreshTeamState,
  usePostManuscript,
  useTeamById,
  useUploadManuscriptFile,
} from './state';
import { useEligibilityReason } from './useEligibilityReason';
import { useManuscriptToast } from './useManuscriptToast';

type TeamManuscriptProps = {
  teamId: string;
};
const TeamManuscript: React.FC<TeamManuscriptProps> = ({ teamId }) => {
  const setRefreshTeamState = useSetRecoilState(refreshTeamState(teamId));

  const team = useTeamById(teamId);

  const { eligibilityReasons } = useEligibilityReason();
  const { setShowSuccessBanner } = useManuscriptToast();
  const form = useForm();
  const createManuscript = usePostManuscript();
  const handleFileUpload = useUploadManuscriptFile();
  const getTeamSuggestions = useTeamSuggestions();
  const getLabSuggestions = useLabSuggestions();

  const pushFromHere = usePushFromHere();

  const onSuccess = () => {
    const path = networkRoutes.DEFAULT.TEAMS.DETAILS.WORKSPACE.buildPath({
      teamId,
    });
    setShowSuccessBanner(true);
    setRefreshTeamState((value) => value + 1);
    pushFromHere(path);
  };

  const selectedTeams = [
    {
      label: team?.displayName || '',
      value: teamId,
      isFixed: true,
    },
  ];

  return (
    <FormProvider {...form}>
      <Frame title="Create Manuscript">
        <ManuscriptHeader />
        <ManuscriptForm
          onSuccess={onSuccess}
          onSave={createManuscript}
          teamId={teamId}
          handleFileUpload={handleFileUpload}
          eligibilityReasons={eligibilityReasons}
          getTeamSuggestions={getTeamSuggestions}
          selectedTeams={selectedTeams}
          getLabSuggestions={getLabSuggestions}
        />
      </Frame>
    </FormProvider>
  );
};
export default TeamManuscript;
