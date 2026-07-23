import { FC, lazy, Suspense } from 'react';

import { ENVIRONMENT } from './config';

// The root ReactQueryDevtools export renders null outside NODE_ENV=development,
// so deployed (production-build) environments lazy-load the production panel
// instead; the chunk only downloads when QUERY_DEVTOOLS is enabled.
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools/production').then((module) => ({
    default: module.ReactQueryDevtools,
  })),
);

const ReactQueryDevtoolsProduction: FC = () => {
  // never on the production environment, regardless of the QUERY_DEVTOOLS flag
  if (ENVIRONMENT === 'production') {
    return null;
  }
  return (
    <Suspense fallback={null}>
      <ReactQueryDevtools initialIsOpen={false} />
    </Suspense>
  );
};

export default ReactQueryDevtoolsProduction;
