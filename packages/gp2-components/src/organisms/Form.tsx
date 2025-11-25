import { ValidationErrorResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePushFromHere } from '@asap-hub/react-components';

const styles = css({
  boxSizing: 'border-box',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'max-content 1fr',
  overflow: 'auto',
});

export type FormStatus = 'initial' | 'isSaving' | 'hasError' | 'hasSaved';

export type GetWrappedOnSave<T> = (
  onSaveFunction: () => Promise<T | void>,
  addNotification: (error: string) => void,
  onDisplayModal: (() => void) | null,
) => () => Promise<T | void>;

type FormProps<T> = {
  validate?: () => boolean;
  dirty: boolean; // mandatory so that it cannot be forgotten
  serverErrors?: ValidationErrorResponse['data'];
  children: (state: {
    isSaving: boolean;
    setRedirectOnSave: (url: string) => void;
    getWrappedOnSave: GetWrappedOnSave<T>;
    onCancel: () => void;
  }) => ReactNode;
};
const Form = <T extends void | Record<string, unknown>>({
  dirty,
  children,
  validate = () => true,
  serverErrors = [],
}: FormProps<T>): React.ReactElement => {
  const navigate = useNavigate();

  const pushFromHere = usePushFromHere();
  const [redirectOnSave, setRedirectOnSave] = useState<string>();

  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<FormStatus>('initial');

  useEffect(() => {
    if (status === 'hasSaved' && redirectOnSave) {
      pushFromHere(redirectOnSave);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, redirectOnSave, dirty]);
  useEffect(() => {
    if (serverErrors.length && formRef.current) {
      formRef.current.reportValidity();
    }
  }, [serverErrors]);

  // Replace Prompt with beforeunload event for unsaved changes warning
  useEffect(() => {
    const shouldWarn =
      status === 'isSaving' ||
      status === 'hasError' ||
      (status === 'initial' && dirty);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (shouldWarn) {
        e.preventDefault();
        e.returnValue =
          'Are you sure you want to leave? Unsaved changes will be lost.';
        return e.returnValue;
      }
      return undefined;
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [status, dirty]);

  const getWrappedOnSave =
    (
      onSaveFunction: () => Promise<T | void>,
      addNotification: (error: string) => void,
      onDisplayModal: (() => void) | null,
    ) =>
    async () => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      if (!(formRef.current!.reportValidity() && validate())) {
        addNotification(
          'There are some errors in the form. Please correct the fields below.',
        );
        return Promise.resolve();
      }

      if (onDisplayModal) {
        onDisplayModal();
        return Promise.resolve();
      }

      setStatus('isSaving');
      try {
        const result = await onSaveFunction();

        if (formRef.current && result) {
          setStatus('hasSaved');
        } else {
          throw new Error('Form saving error.');
        }
        return result;
      } catch {
        if (formRef.current) {
          setStatus('hasError');
          addNotification(
            'There was an error and we were unable to save your changes. Please try again.',
          );
        }
        return Promise.resolve();
      }
    };

  const onCancel = () => {
    setStatus('initial');
    // In React Router v6, location.key is always set, so we check history.length instead
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <form ref={formRef} css={styles}>
      {children({
        onCancel,
        isSaving: status === 'isSaving',
        getWrappedOnSave,
        setRedirectOnSave,
      })}
    </form>
  );
};
export default Form;
