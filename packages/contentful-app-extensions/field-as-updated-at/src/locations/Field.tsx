import React, { useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EntrySys, FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const { observedField } = sdk.parameters.instance;
  const observedFields: string[] = String(observedField)
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

  const [field, setField] = useState(sdk.field.getValue());

  const readObserved = () =>
    observedFields.map((name) =>
      documentToHtmlString(sdk.entry.fields[name].getValue()),
    );

  const initialValues = readObserved();
  const initialPublishedVersion = sdk.entry.getSys().publishedCounter;

  const unsubscribe = sdk.entry.onSysChanged(async (sys: EntrySys) => {
    const currentPublishedVersion = sys.publishedCounter;
    const currentValues = readObserved();
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
