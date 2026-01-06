import { ValidationErrorResponse } from '@asap-hub/model';
import { InnerToastContext, ToastContext } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useNavigationWarning } from '../navigation';

const styles = css({
  boxSizing: 'border-box',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'max-content 1fr',
  overflow: 'auto',
  justifyContent: 'center',
});

type FormStatus = 'initial' | 'isSaving' | 'hasError' | 'hasSaved';

type FormProps<T> = {
  validate?: () => boolean;
  dirty: boolean;
  serverErrors?: ValidationErrorResponse['data'];
  toastType?: 'inner' | 'base';
  children: (state: {
    isSaving: boolean;
    setRedirectOnSave: (url: string) => void;
    getWrappedOnSave: (
      onSaveFunction: () => Promise<T | void>,
    ) => () => Promise<T | void>;
    onCancel: () => void;
  }) => ReactNode;
};

const Form = <T extends void | Record<string, unknown>>({
  dirty,
  children,
  validate = () => true,
  serverErrors = [],
  toastType = 'base',
}: FormProps<T>): React.ReactElement => {
  const toast = useContext(
    toastType === 'inner' ? InnerToastContext : ToastContext,
  );
  const navigate = useNavigate();

  const redirectOnSaveRef = useRef<string>();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('initial');

  const handleSetRedirectOnSave = (url: string) => {
    redirectOnSaveRef.current = url;
  };

  useEffect(() => {
    if (status === 'hasSaved' && redirectOnSaveRef.current) {
      navigate(redirectOnSaveRef.current);
    }
  }, [status, navigate]);

  useEffect(() => {
    if (serverErrors.length && formRef.current) {
      formRef.current.reportValidity();
    }
  }, [serverErrors, toast]);

  const shouldWarn =
    status === 'isSaving' ||
    status === 'hasError' ||
    (status === 'initial' && dirty);

  const { blockedNavigate } = useNavigationWarning({
    shouldBlock: shouldWarn,
  });

  const getWrappedOnSave =
    (onSaveFunction: () => Promise<T | void>) => async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!(formRef.current!.reportValidity() && validate())) {
        toast(
          'There are some errors in the form. Please correct the fields below.',
        );
        return Promise.resolve();
      }
      setStatus('isSaving');
      try {
        const result = await onSaveFunction();

        if (result) {
          setStatus('hasSaved');
        } else {
          throw new Error('Form saving error.');
        }
        return result;
      } catch {
        if (formRef.current) {
          setStatus('hasError');
          toast(
            'There was an error and we were unable to save your changes. Please try again.',
          );
        }
        return Promise.resolve();
      }
    };

  const onCancel = () => {
    setStatus('initial');
    if (window.history.length > 1) {
      blockedNavigate(-1);
    } else {
      blockedNavigate('/');
    }
  };

  return (
    <form ref={formRef} css={styles}>
      {children({
        onCancel,
        isSaving: status === 'isSaving',
        getWrappedOnSave,
        setRedirectOnSave: handleSetRedirectOnSave,
      })}
    </form>
  );
};

export default Form;
