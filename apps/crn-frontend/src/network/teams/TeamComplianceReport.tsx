import { Frame } from '@asap-hub/frontend-utils';
import {
  ComplianceReportForm,
  ComplianceReportHeader,
  NotFoundPage,
  usePushFromHere,
} from '@asap-hub/react-components';
import { network } from '@asap-hub/routing';
import { FormProvider, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
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
  const manuscript = useManuscriptById(manuscriptId);
  const { setShowSuccessBanner, setFormType } = useManuscriptToast();

  const pushFromHere = usePushFromHere();

  const setRefreshTeamState = useSetRecoilState(refreshTeamState(teamId));
  const form = useForm();
  const createComplianceReport = usePostComplianceReport();

  if (manuscript && manuscript.versions[0]) {
    const onSuccess = () => {
      const path = network({}).teams({}).team({ teamId }).workspace({}).$;
      setShowSuccessBanner(true);
      setFormType('compliance-report');
      setRefreshTeamState((value) => value + 1);
      pushFromHere(path);
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
          />
        </Frame>
      </FormProvider>
    );
  }

  return <NotFoundPage />;
};
export default TeamComplianceReport;
