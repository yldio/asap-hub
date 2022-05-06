import { useCurrentUser } from '@asap-hub/react-context';
import { setContext } from '@sentry/react';

const SentryAuth0: React.FC = () => {
  const user = useCurrentUser();
  setContext('user', user);
  return null;
};

export default SentryAuth0;
