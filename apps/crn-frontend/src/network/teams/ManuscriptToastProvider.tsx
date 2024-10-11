import { Toast } from '@asap-hub/react-components';
import React, { createContext, useState } from 'react';

type FormType = 'manuscript' | 'compliance-report' | '';

type ManuscriptToastContextData = {
  setShowSuccessBanner: React.Dispatch<React.SetStateAction<boolean>>;
  setFormType: React.Dispatch<React.SetStateAction<FormType>>;
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
  const [formType, setFormType] = useState<FormType>('');

  const formTypeMapping = {
    manuscript: 'Manuscript',
    'compliance-report': 'Compliance Report',
  };

  return (
    <ManuscriptToastContext.Provider
      value={{ setShowSuccessBanner, setFormType }}
    >
      <>
        {showSuccessBanner && !!formType && (
          <Toast
            accent="successLarge"
            onClose={() => setShowSuccessBanner(false)}
          >
            {formTypeMapping[formType]} submitted successfully.
          </Toast>
        )}
        {children}
      </>
    </ManuscriptToastContext.Provider>
  );
};
