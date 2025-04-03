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
  | '';

type ManuscriptToastType = {
  type: FormType;
  accent: ToastAccents;
};

type ManuscriptToastContextData = {
  setFormType: React.Dispatch<React.SetStateAction<ManuscriptToastType>>;
};

export type ToastAccents = 'error' | 'successLarge';

export const ManuscriptToastContext = createContext<ManuscriptToastContextData>(
  {} as ManuscriptToastContextData,
);

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
