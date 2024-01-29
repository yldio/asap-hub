import React, { useState } from 'react';
import { Text } from '@contentful/f36-components';
import { EntrySys, FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const [field] = useState(sdk.field.getValue());

  return <Text>{field ?? sdk.entry.getSys().firstPublishedAt}</Text>;
};

export default Field;
