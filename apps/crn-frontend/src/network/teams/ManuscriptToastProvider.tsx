import { Toast } from '@asap-hub/react-components';
import React, { createContext, useState } from 'react';

type FormType =
  | 'manuscript'
  | 'compliance-report'
  | 'quick-check'
  | 'compliance-report-discussion'
  | 'compliance-report-discussion-end'
  | '';

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
    manuscript: 'Manuscript submitted successfully.',
    'compliance-report': 'Compliance Report submitted successfully.',
    'quick-check': 'Replied to quick check successfully.',
    'compliance-report-discussion': 'Discussion started successfully.',
    'compliance-report-discussion-end': 'Discussion ended successfully.',
  };

  return (
    <ManuscriptToastContext.Provider value={{ setFormType }}>
      <>
        {!!formType && (
          <Toast accent="successLarge" onClose={() => setFormType('')}>
            {formTypeMapping[formType]}
          </Toast>
        )}
        {children}
      </>
    </ManuscriptToastContext.Provider>
  );
};
