import { Frame } from '@asap-hub/frontend-utils';
import {
  ManuscriptForm,
  ManuscriptHeader,
  usePushFromHere,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FormProvider, useForm } from 'react-hook-form';
import { useSetRecoilState } from 'recoil';
import { refreshTeamState, usePostManuscript } from './state';
import { useManuscriptToast } from './useManuscriptToast';

type TeamManuscriptProps = {
  teamId: string;
};
const TeamManuscript: React.FC<TeamManuscriptProps> = ({ teamId }) => {
  const setRefreshTeamState = useSetRecoilState(refreshTeamState(teamId));

  const { setShowSuccessBanner } = useManuscriptToast();
  const form = useForm();
  const createManuscript = usePostManuscript();

  const pushFromHere = usePushFromHere();

  const onSuccess = () => {
    const path = network({}).teams({}).team({ teamId }).workspace({}).$;
    setShowSuccessBanner(true);
    setRefreshTeamState((value) => value + 1);
    pushFromHere(path);
  };

  const handleFileUpload = async (file: File): Promise<string> => {
    // some upload here

    return 'url';
  };

  return (
    <FormProvider {...form}>
      <Frame title="Create Manuscript">
        <ManuscriptHeader />
        <ManuscriptForm
          onSuccess={onSuccess}
          onSave={createManuscript}
          teamId={teamId}
          handleFileUpload={handleFileUpload}
        />
      </Frame>
    </FormProvider>
  );
};
export default TeamManuscript;
