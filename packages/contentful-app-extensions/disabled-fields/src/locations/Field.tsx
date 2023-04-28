import React, { useEffect } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  return <Paragraph>{sdk.field.getValue()}</Paragraph>;
};

export default Field;
