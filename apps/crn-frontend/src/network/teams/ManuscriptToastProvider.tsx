import { Toast } from '@asap-hub/react-components';
import React, { createContext, useState } from 'react';

type ManuscriptToastContextData = {
  setShowSuccessBanner: React.Dispatch<React.SetStateAction<boolean>>;
};

export const ManuscriptToastContext = createContext<ManuscriptToastContextData>(
  {} as ManuscriptToastContextData,
);

export const ManuscriptToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showSuccessBanner, setShowSuccessBanner] = useState<boolean>(false);

  return (
    <ManuscriptToastContext.Provider value={{ setShowSuccessBanner }}>
      <>
        {showSuccessBanner && (
          <Toast
            accent="successLarge"
            onClose={() => setShowSuccessBanner(false)}
          >
            Manuscript submitted successfully.
          </Toast>
        )}
        {children}
      </>
    </ManuscriptToastContext.Provider>
  );
};
