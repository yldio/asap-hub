import React, { Suspense, ComponentProps, ReactNode } from 'react';
import { Titled } from 'react-titled';
import { Loading } from '@asap-hub/react-components';

import ErrorBoundary from './ErrorBoundary';

type FrameProps = {
  title: string | null; // explicit null, omitting prop not allowed to make sure title is not forgotten when adding a page
  children: ReactNode;
  fallback: ComponentProps<typeof Suspense>['fallback'];
};

type FrameBoundaryProps = {
  title: string | null; // explicit null, omitting prop not allowed to make sure title is not forgotten when adding a page
  boundaryProps?: Omit<ComponentProps<typeof ErrorBoundary>, 'children'>;
  fallback?: ComponentProps<typeof Suspense>['fallback'];
};

const Frame = ({ fallback, children, title }: FrameProps) => (
  <Titled
    title={(parentTitle) =>
      title ? (parentTitle ? `${title} | ${parentTitle}` : title) : parentTitle
    }
  >
    <Suspense fallback={fallback}>{children}</Suspense>
  </Titled>
);

const DefaultFrame: React.FC<FrameBoundaryProps> = ({
  children,
  title,
  boundaryProps,
  fallback = <Loading />,
}) => (
  <ErrorBoundary {...boundaryProps}>
    <Frame title={title} fallback={fallback}>
      {children}
    </Frame>
  </ErrorBoundary>
);

export const SearchFrame: React.FC<Omit<FrameBoundaryProps, 'boundaryProps'>> =
  ({ children, title, fallback = <Loading /> }) => (
    <ErrorBoundary
      title={'Something went wrong'}
      description={'There was a problem with your search, please try again.'}
      error={new Error()}
    >
      <Frame title={title} fallback={fallback}>
        {children}
      </Frame>
    </ErrorBoundary>
  );

export default DefaultFrame;
