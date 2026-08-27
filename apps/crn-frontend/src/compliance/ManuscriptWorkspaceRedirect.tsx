import { ManuscriptWorkspaceUnavailablePage } from '@asap-hub/react-components';
import { compliance, useRouteParams } from '@asap-hub/routing';
import { FC } from 'react';
import { Navigate, useLocation } from 'react-router';
import { useManuscriptWorkspaceUrl } from '../network/teams/state';

const ManuscriptWorkspaceRedirect: FC = () => {
  const { manuscriptId } = useRouteParams(compliance({}).manuscript);
  const { search } = useLocation();
  const tab = new URLSearchParams(search).get('tab');
  const workspaceUrl = useManuscriptWorkspaceUrl(
    manuscriptId,
    tab === 'discussions' ? 'discussions' : undefined,
  );

  if (!workspaceUrl?.url) {
    return <ManuscriptWorkspaceUnavailablePage />;
  }

  return (
    <Navigate to={workspaceUrl.url} replace state={{ scrollToHash: true }} />
  );
};

export default ManuscriptWorkspaceRedirect;
