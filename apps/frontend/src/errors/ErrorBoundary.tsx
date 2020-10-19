import React, { ReactNode } from 'react';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { useLocation } from 'react-router-dom';
import { ErrorCard } from '@asap-hub/react-components';

const ErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => {
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
      key={`${pathname}${search}`}
      FallbackComponent={ErrorCard}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;
