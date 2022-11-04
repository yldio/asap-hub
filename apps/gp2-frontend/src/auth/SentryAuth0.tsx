import { useCurrentUserGP2 } from '@asap-hub/react-context';
import { setContext } from '@sentry/react';

const SentryAuth0: React.FC = () => {
  const user = useCurrentUserGP2();
  setContext('user', user);
  return null;
};

export default SentryAuth0;
