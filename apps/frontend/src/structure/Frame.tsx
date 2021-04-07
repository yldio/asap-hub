import React, { Suspense, ComponentProps } from 'react';
import { Titled } from 'react-titled';
import { Loading } from '@asap-hub/react-components';

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

export const SearchFrame: React.FC<Pick<FrameProps, 'title'>> = ({
  children,
  ...props
}) => (
  <Frame
    {...props}
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
