import { Toast } from '@asap-hub/react-components';
import React, { createContext, useState } from 'react';

type FormType = 'manuscript' | 'compliance-report' | '';

type ManuscriptToastContextData = {
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
  const [formType, setFormType] = useState<FormType>('');

  const formTypeMapping = {
    manuscript: 'Manuscript',
    'compliance-report': 'Compliance Report',
  };

  return (
    <ManuscriptToastContext.Provider value={{ setFormType }}>
      <>
        {!!formType && (
          <Toast accent="successLarge" onClose={() => setFormType('')}>
            {formTypeMapping[formType]} submitted successfully.
          </Toast>
        )}
        {children}
      </>
    </ManuscriptToastContext.Provider>
  );
};
