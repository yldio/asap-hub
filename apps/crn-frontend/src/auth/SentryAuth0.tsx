import { useCurrentUserCRN } from '@asap-hub/react-context';
import { setContext } from '@sentry/react';

const SentryAuth0: React.FC = () => {
  const user = useCurrentUserCRN();
  setContext('user', user);
  return null;
};

export default SentryAuth0;
