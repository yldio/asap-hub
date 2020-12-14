import React, { Suspense } from 'react';
import { Loading } from '@asap-hub/react-components';

import ErrorBoundary from './ErrorBoundary';

const Frame: React.FC<{}> = ({ children }) => (
  <ErrorBoundary>
    <Suspense fallback={<Loading />}>{children}</Suspense>
  </ErrorBoundary>
);

export default Frame;
