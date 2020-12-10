import React, { Suspense, ComponentProps } from 'react';
import { Loading } from '@asap-hub/react-components';

import ErrorBoundary from './ErrorBoundary';

type FrameProps = {
  boundaryProps?: Omit<ComponentProps<typeof ErrorBoundary>, 'children'>;
};

const Frame: React.FC<FrameProps> = ({ children, boundaryProps }) => (
  <ErrorBoundary {...boundaryProps}>
    <Suspense fallback={<Loading />}>{children}</Suspense>
  </ErrorBoundary>
);

export default Frame;
