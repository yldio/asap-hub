import React, { useState, useEffect } from 'react';
import { Text } from '@contentful/f36-components';
import { EntrySys, FieldAppSDK } from '@contentful/app-sdk';
import { useFieldValue, useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const [value, setValue] = useFieldValue();

  useEffect(() => {
    if (!sdk.entry.getSys().firstPublishedAt) {
      setValue(new Date().toISOString());
    }

    if (sdk.entry.getSys().firstPublishedAt && !value) {
      setValue(sdk.entry.getSys().firstPublishedAt);
    }
  }, []);

  return <Text>{value}</Text>;
};

export default Field;
