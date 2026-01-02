import { Toast } from '@asap-hub/react-components';
import React, { createContext, useState } from 'react';

type FormType =
  | 'assigned-users'
  | 'manuscript'
  | 'server-validation-error'
  | 'default-error'
  | 'compliance-report'
  | 'reply-to-discussion'
  | 'discussion-started'
  | 'manuscript-status-error'
  | '';

type ManuscriptToastType = {
  type: FormType;
  accent: ToastAccents;
};

type ManuscriptToastContextData = {
  setFormType: React.Dispatch<React.SetStateAction<ManuscriptToastType>>;
};

export type ToastAccents = 'error' | 'successLarge';

const defaultContextValue: ManuscriptToastContextData = {
  // istanbul ignore next
  setFormType: () => {
    // No-op default function to prevent errors if used outside provider
  },
};

export const ManuscriptToastContext =
  createContext<ManuscriptToastContextData>(defaultContextValue);

export const ManuscriptToastProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [formType, setFormType] = useState<ManuscriptToastType>({
    type: '',
    accent: 'successLarge',
  });

  const formTypeMapping = {
    'assigned-users': 'User(s) assigned to a manuscript successfully.',
    manuscript: 'Manuscript submitted successfully.',
    'server-validation-error':
      'There are some errors in the form. Please correct the fields below.',
    'default-error': 'An error has occurred. Please try again later.',
    'compliance-report': 'Compliance Report submitted successfully.',
    'reply-to-discussion': 'Replied to discussion successfully.',
    'discussion-started': 'Discussion started successfully.',
    'manuscript-status-error':
      'The manuscript status has been changed to compliant or closed, which disables new discussions and replies. Please email the Open Science team at openscience@parkinsonsroadmap.org if you have additional questions related to this manuscript.',
  };

  return (
    <ManuscriptToastContext.Provider value={{ setFormType }}>
      <>
        {!!formType.type && (
          <Toast
            accent={formType.accent}
            onClose={() => setFormType({ type: '', accent: 'successLarge' })}
          >
            {formTypeMapping[formType.type]}
          </Toast>
        )}
        {children}
      </>
    </ManuscriptToastContext.Provider>
  );
};
