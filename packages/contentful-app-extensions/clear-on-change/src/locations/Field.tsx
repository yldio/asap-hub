import React, { useEffect, useRef } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK, useFieldValue } from '@contentful/react-apps-toolkit';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  const { observedField } = sdk.parameters.instance;
  const [observedFieldValue] = useFieldValue(observedField);
  const [currentFieldValue, setCurrentFieldValue] = useFieldValue();
  const firstUpdate = useRef(true);

  useEffect(() => {
    if (!firstUpdate.current) {
      setCurrentFieldValue(null);
    } else {
      firstUpdate.current = false;
    }
  }, [observedFieldValue]);

  return <Paragraph>{currentFieldValue}</Paragraph>;
};

export default Field;
