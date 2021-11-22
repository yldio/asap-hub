import { Suspense, ComponentProps } from 'react';
import { Titled } from 'react-titled';
import { Loading } from '@asap-hub/react-components';

import ErrorBoundary from './ErrorBoundary';

type FrameProps = {
  title: string | null; // explicit null, omitting prop not allowed to make sure title is not forgotten when adding a page
  boundaryProps?: Omit<ComponentProps<typeof ErrorBoundary>, 'children'>;
  fallback?: ComponentProps<typeof Suspense>['fallback'];
  wrapper?: 'ReactErrorBoundary' | 'SentryErrorBoundary';
};

const Frame: React.FC<FrameProps> = ({
  children,
  title,
  boundaryProps,
  wrapper = 'ReactErrorBoundary',
  fallback = <Loading />,
}) => (
  <ErrorBoundary {...boundaryProps} wrapper={wrapper}>
    <Titled
      title={(parentTitle) =>
        title
          ? parentTitle
            ? `${title} | ${parentTitle}`
            : title
          : parentTitle
      }
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </Titled>
  </ErrorBoundary>
);

export const SearchFrame: React.FC<FrameProps> = (boundaryProps) => (
  <Frame wrapper="SentryErrorBoundary" {...boundaryProps} />
);

export default Frame;
