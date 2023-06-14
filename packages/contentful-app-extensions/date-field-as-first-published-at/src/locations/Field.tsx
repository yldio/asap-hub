import React, { useState } from 'react';
import { Text } from '@contentful/f36-components';
import { EntrySys, FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const [field, setField] = useState(sdk.field.getValue());

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  let unsubscribe = () => {};

  unsubscribe = sdk.entry.onSysChanged(async (sys: EntrySys) => {
    if (!field && sys.firstPublishedAt) {
      setField(sys.firstPublishedAt);
      await sdk.field.setValue(sys.firstPublishedAt);
      await sdk.entry.publish();
      unsubscribe();
    }
  });

  return <Text>{field ?? ''}</Text>;
};

export default Field;
