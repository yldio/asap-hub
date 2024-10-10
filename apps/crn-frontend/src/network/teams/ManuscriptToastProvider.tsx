import { Toast } from '@asap-hub/react-components';
import React, { createContext, useState } from 'react';

type ComplianceFormType = 'manuscript' | 'compliance-report' | '';

type ManuscriptToastContextData = {
  setShowSuccessBanner: React.Dispatch<React.SetStateAction<boolean>>;
  setComplianceFormType: React.Dispatch<
    React.SetStateAction<ComplianceFormType>
  >;
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
  const [complianceFormType, setComplianceFormType] =
    useState<ComplianceFormType>('');

  const complianceFormTypeMapping = {
    manuscript: 'Manuscript',
    'compliance-report': 'Compliance Report',
  };

  return (
    <ManuscriptToastContext.Provider
      value={{ setShowSuccessBanner, setComplianceFormType }}
    >
      <>
        {showSuccessBanner && !!complianceFormType && (
          <Toast
            accent="successLarge"
            onClose={() => setShowSuccessBanner(false)}
          >
            {complianceFormTypeMapping[complianceFormType]} submitted
            successfully.
          </Toast>
        )}
        {children}
      </>
    </ManuscriptToastContext.Provider>
  );
};
