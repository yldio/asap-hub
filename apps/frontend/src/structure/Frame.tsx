import { Suspense, ComponentProps } from 'react';
import { Titled } from 'react-titled';
import { Loading, ErrorCard } from '@asap-hub/react-components';
import { ErrorBoundary as SentryErrorBoundary } from '@sentry/react';

import ErrorBoundary from './ErrorBoundary';

type FrameProps = {
  title: string | null; // explicit null, omitting prop not allowed to make sure title is not forgotten when adding a page
  boundaryProps?: Omit<ComponentProps<typeof ErrorBoundary>, 'children'>;
  fallback?: ComponentProps<typeof Suspense>['fallback'];
};

const Frame: React.FC<FrameProps> = ({
  children,
  title,
  boundaryProps,
  fallback = <Loading />,
}) => (
  <ErrorBoundary {...boundaryProps}>
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

export const SearchFrame: React.FC<FrameProps> = ({
  children,
  title,
  fallback = <Loading />,
}) => (
  <SentryErrorBoundary
    fallback={
      <ErrorCard
        title={'Something went wrong'}
        description={
          'We’re sorry, we couldn’t fetch search results due to an error.'
        }
      />
    }
  >
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
  </SentryErrorBoundary>
);

export default Frame;
