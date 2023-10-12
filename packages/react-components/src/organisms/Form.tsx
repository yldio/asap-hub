import { ValidationErrorResponse } from '@asap-hub/model';
import { InnerToastContext, ToastContext } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';
import { usePushFromHere } from '../routing';

const styles = css({
  boxSizing: 'border-box',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'max-content 1fr',
  overflow: 'auto',
});

type FormStatus = 'initial' | 'isSaving' | 'hasError' | 'hasSaved';

type FormProps<T> = {
  validate?: () => boolean;
  dirty: boolean; // mandatory so that it cannot be forgotten
  serverErrors?: ValidationErrorResponse['data'];
  toastType?: 'inner' | 'base';
  children: (state: {
    isSaving: boolean;
    setRedirectOnSave: (url: string) => void;
    getWrappedOnSave: (
      onSaveFunction: () => Promise<T | void>,
    ) => () => Promise<T | void>;
    onCancel: () => void;
    status: FormStatus;
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
  const history = useHistory();

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
  }, [serverErrors, toast]);

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

        if (formRef.current && result) {
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
    history.location.key ? history.goBack() : history.push('/');
  };

  return (
    <>
      <Prompt
        when={
          status === 'isSaving' ||
          status === 'hasError' ||
          (status === 'initial' && dirty)
        }
        message={() => {
          toast(null);
          return 'Are you sure you want to leave? Unsaved changes will be lost.';
        }}
      />
      <form ref={formRef} css={styles}>
        {children({
          onCancel,
          isSaving: status === 'isSaving',
          getWrappedOnSave,
          setRedirectOnSave,
          status,
        })}
      </form>
    </>
  );
};
export default Form;
