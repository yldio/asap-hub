import { useEffect } from 'react';
import { Frame } from '@asap-hub/frontend-utils';
import {
  ComplianceReportForm,
  ComplianceReportHeader,
  NotFoundPage,
  usePushFromHere,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams, useLocation } from 'react-router';
import { useSetRecoilState } from 'recoil';
import {
  refreshTeamState,
  useManuscriptById,
  usePostComplianceReport,
} from './state';
import { useManuscriptToast } from './useManuscriptToast';

type TeamComplianceReportProps = {
  teamId: string;
};
const TeamComplianceReport: React.FC<TeamComplianceReportProps> = ({
  teamId,
}) => {
  const { manuscriptId } = useParams<{ manuscriptId: string }>();
  const [manuscript, setManuscript] = useManuscriptById(manuscriptId ?? '');
  const { setFormType } = useManuscriptToast();

  const pushFromHere = usePushFromHere();
  const { state } = useLocation();

  const setRefreshTeamState = useSetRecoilState(refreshTeamState(teamId));
  const form = useForm();
  const createComplianceReport = usePostComplianceReport();

  const teamWorkspacePath = network({})
    .teams({})
    .team({ teamId })
    .workspace({}).$;

  useEffect(() => {
    window.scrollTo({ top: 0 });

    const { fromButton } = (state as { fromButton?: boolean }) ?? {};
    if (fromButton) return;

    pushFromHere(teamWorkspacePath, { replace: true });
  }, [pushFromHere, state, teamWorkspacePath]);

  if (manuscript && manuscript.versions[0]) {
    const onSuccess = () => {
      setFormType({
        type: 'compliance-report',
        accent: 'successLarge',
      });
      setRefreshTeamState((value) => value + 1);
      pushFromHere(teamWorkspacePath, { replace: true });
    };

    return (
      <FormProvider {...form}>
        <Frame title="Create Compliance Report">
          <ComplianceReportHeader />
          <ComplianceReportForm
            onSuccess={onSuccess}
            onSave={createComplianceReport}
            manuscriptTitle={manuscript.title}
            manuscriptVersionId={manuscript.versions[0].id}
            setManuscript={setManuscript}
            manuscriptId={manuscriptId ?? ''}
          />
        </Frame>
      </FormProvider>
    );
  }

  return <NotFoundPage />;
};
export default TeamComplianceReport;
