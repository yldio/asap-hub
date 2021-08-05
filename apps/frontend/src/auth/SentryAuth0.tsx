import { useCurrentUser } from '@asap-hub/react-context';
import * as Sentry from '@sentry/react';

const SentryAuth0: React.FC = () => {
  const user = useCurrentUser();
  Sentry.setContext('user', user);
  return null;
};

export default SentryAuth0;
