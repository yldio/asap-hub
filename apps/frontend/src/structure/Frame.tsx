import React, { Suspense, ComponentProps } from 'react';
import { Loading } from '@asap-hub/react-components';

import ErrorBoundary from './ErrorBoundary';

type FrameProps = {
  boundaryProps?: Omit<ComponentProps<typeof ErrorBoundary>, 'children'>;
  fallback?: ComponentProps<typeof Suspense>['fallback'];
};

const Frame: React.FC<FrameProps> = ({
  children,
  boundaryProps,
  fallback = <Loading />,
}) => (
  <ErrorBoundary {...boundaryProps}>
    <Suspense fallback={fallback}>{children}</Suspense>
  </ErrorBoundary>
);

export const SearchFrame: React.FC = ({ children }) => (
  <Frame
    boundaryProps={{
      description:
        'We’re sorry, we couldn’t fetch search results due to an error.',
      refreshLink: true,
    }}
  >
    {children}
  </Frame>
);

export default Frame;
