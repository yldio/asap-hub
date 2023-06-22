import React, { useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EntrySys, FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const { observedField } = sdk.parameters.instance;
  const [field, setField] = useState(sdk.field.getValue());

  const initialValue = documentToHtmlString(
    sdk.entry.fields[observedField].getValue(),
  );
  const initialPublishedVersion = sdk.entry.getSys().publishedCounter;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unsubscribe = () => {};
  unsubscribe = sdk.entry.onSysChanged(async (sys: EntrySys) => {
    const currentPublishedVersion = sys.publishedCounter;
    const currentValue = documentToHtmlString(
      sdk.entry.fields[observedField].getValue(),
    );

    if (
      currentPublishedVersion &&
      initialPublishedVersion &&
      currentPublishedVersion > initialPublishedVersion &&
      currentValue !== initialValue
    ) {
      setField(currentValue ? sys.publishedAt : undefined);
      await sdk.field.setValue(sys.publishedAt);
      await sdk.entry.publish();
      unsubscribe();
    }
  });

  return <Paragraph>{field}</Paragraph>;
};

export default Field;
