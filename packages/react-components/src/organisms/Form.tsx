import { ValidationErrorResponse } from '@asap-hub/model';
import { ToastContext } from '@asap-hub/react-context';
import { css } from '@emotion/react';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { Prompt, useHistory } from 'react-router-dom';

const styles = css({
  boxSizing: 'border-box',
  height: '100%',
  display: 'grid',
  gridTemplateRows: 'max-content 1fr',
  overflow: 'auto',
});

type FormProps<T> = {
  onSave: () => Promise<T | void>;
  validate?: () => boolean;
  dirty: boolean; // mandatory so that it cannot be forgotten
  serverErrors?: ValidationErrorResponse['data'];
  children: (state: {
    isSaving: boolean;
    onSave: () => void | Promise<T | void>;
    onCancel: () => void;
  }) => ReactNode;
};
const Form = <T extends void | Record<string, unknown>>({
  dirty,
  children,
  validate = () => true,
  onSave,
  serverErrors = [],
}: FormProps<T>): React.ReactElement => {
  const toast = useContext(ToastContext);
  const history = useHistory();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] =
    useState<'initial' | 'isSaving' | 'hasError' | 'hasSaved'>('initial');
  useEffect(() => {
    if (status === 'hasSaved' && !dirty) {
      setStatus('initial');
    }
  }, [status, dirty]);
  useEffect(() => {
    if (serverErrors.length && formRef.current) {
      formRef.current.reportValidity();
    }
  }, [serverErrors]);
  const wrappedOnSave = async () => {
    const parentValidation = validate();
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    if (formRef.current!.reportValidity() && parentValidation) {
      setStatus('isSaving');
      try {
        return await onSave().then((result) => {
          if (formRef.current) {
            setStatus('hasSaved');
          }
          return result;
        });
      } catch {
        if (formRef.current) {
          setStatus('hasError');
          toast(
            'There was an error and we were unable to save your changes. Please try again.',
          );
        }
      }
    }
    return Promise.resolve();
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
          onSave: wrappedOnSave,
        })}
      </form>
    </>
  );
};
export default Form;
