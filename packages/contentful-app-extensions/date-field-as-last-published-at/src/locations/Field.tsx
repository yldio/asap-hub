import React, { useEffect, useState } from 'react';
import { DateEditor } from '@contentful/field-editor-date';
import { EntrySys, FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const initialPublishedVersion = sdk.entry.getSys().publishedCounter;

  useEffect(() => {
    sdk.window.startAutoResizer({ absoluteElements: true });
  }, [sdk.window]);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unsubscribe = () => {};
  unsubscribe = sdk.entry.onSysChanged(async (sys: EntrySys) => {
    const currentPublishedVersion = sys.publishedCounter;
    const currentAddedDate = sdk.field.getValue();

    if (
      currentPublishedVersion != null &&
      initialPublishedVersion != null &&
      currentPublishedVersion > initialPublishedVersion &&
      !currentAddedDate
    ) {
      await sdk.field.setValue(sys.publishedAt);
      await sdk.entry.publish();
      unsubscribe();
    }
  });

  return <DateEditor field={sdk.field} />;
};

export default Field;
