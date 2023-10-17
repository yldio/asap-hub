import React from 'react';
import { Text } from '@contentful/f36-components';
import { FieldAppSDK } from '@contentful/app-sdk';
import {
  useSDK,
  useAutoResizer,
  useFieldValue,
} from '@contentful/react-apps-toolkit';

const Field = () => {
  useAutoResizer();
  const sdk = useSDK<FieldAppSDK>();
  const [value, setValue] = useFieldValue();

  if (!value) {
    setValue(sdk.entry.getSys().createdAt);
  }

  return <Text>{value}</Text>;
};

export default Field;
