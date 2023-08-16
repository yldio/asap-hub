import React, { useRef, useEffect } from 'react';
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
  const exclude = sdk.parameters.instance.exclude
    .split(',')
    .map((s: string) => s.trim());

  const values: unknown[] = Object.keys(sdk.entry.fields).reduce(
    (arr: unknown[], field: string): unknown[] => {
      const [val] = useFieldValue(field);
      if (!exclude.includes(field) && field !== sdk.field.id) {
        return [...arr, val];
      }
      return arr;
    },
    [],
  );

  const firstRender = useRef(true);
  useEffect(() => {
    if (!firstRender.current) {
      setValue(new Date().toISOString());
    }
    firstRender.current = false;
  }, values);

  return <Text>{value}</Text>;
};

export default Field;
