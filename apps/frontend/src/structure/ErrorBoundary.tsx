import React, { ReactNode, ComponentProps } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import { ErrorCard } from '@asap-hub/react-components';

type ErrorBoundaryProps = { children: ReactNode } & Partial<
  ComponentProps<typeof ErrorCard>
>;

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  ...errorCardProps
}) => {
  let pathname = '';
  let search = '';
  try {
    // This hook *is* called unconditionally despite what rules-of-hooks says
    /* eslint-disable react-hooks/rules-of-hooks */
    ({ pathname, search } = useLocation());
  } catch (error) {
    // no routing, no way to get out of the error state
  }

  return (
    <ReactErrorBoundary
      fallbackRender={({ error }) => (
        <ErrorCard error={error} {...errorCardProps} />
      )}
      resetKeys={[pathname, search]}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
