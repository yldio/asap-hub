import { FC, lazy, Suspense } from 'react';

// The root ReactQueryDevtools export renders null outside NODE_ENV=development,
// so deployed (production-build) environments lazy-load the production panel
// instead; the chunk only downloads when QUERY_DEVTOOLS is enabled.
const ReactQueryDevtools = lazy(() =>
  import('@tanstack/react-query-devtools/production').then((module) => ({
    default: module.ReactQueryDevtools,
  })),
);

const ReactQueryDevtoolsProduction: FC = () => (
  <Suspense fallback={null}>
    <ReactQueryDevtools initialIsOpen={false} />
  </Suspense>
);

export default ReactQueryDevtoolsProduction;
