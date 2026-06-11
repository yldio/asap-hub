import React, { useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EntrySys, FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const { observedField } = sdk.parameters.instance;
  const [field, setField] = useState(sdk.field.getValue());

  const observedFieldNames = String(observedField)
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  const readValue = (name: string) => {
    const fieldType = sdk.contentType.fields.find((f) => f.id === name)?.type;
    const raw = sdk.entry.fields[name].getValue();
    return fieldType === 'RichText' ? documentToHtmlString(raw) : (raw ?? '');
  };

  const readObservedValues = () => observedFieldNames.map(readValue);

  const initialValues = readObservedValues();
  const initialPublishedVersion = sdk.entry.getSys().publishedCounter;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unsubscribe = () => {};
  unsubscribe = sdk.entry.onSysChanged(async (sys: EntrySys) => {
    const currentPublishedVersion = sys.publishedCounter;
    const currentValues = readObservedValues();
    const anyChanged = currentValues.some(
      (value, index) => value !== initialValues[index],
    );
    const anyPresent = currentValues.some(Boolean);

    if (
      currentPublishedVersion &&
      initialPublishedVersion &&
      currentPublishedVersion > initialPublishedVersion &&
      anyChanged
    ) {
      const newValue = anyPresent ? sys.publishedAt : undefined;
      setField(newValue);
      await sdk.field.setValue(newValue);
      await sdk.entry.publish();
      unsubscribe();
    }
  });

  return <Paragraph>{field}</Paragraph>;
};

export default Field;
