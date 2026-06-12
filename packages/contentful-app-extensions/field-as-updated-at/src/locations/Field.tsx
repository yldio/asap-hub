import React, { useEffect, useState } from 'react';
import { Paragraph } from '@contentful/f36-components';
import { EntrySys, FieldExtensionSDK } from '@contentful/app-sdk';
import { useAutoResizer, useSDK } from '@contentful/react-apps-toolkit';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  useAutoResizer();
  const [field, setField] = useState(sdk.field.getValue());

  useEffect(() => {
    let cancelled = false;
    const { observedField } = sdk.parameters.instance;
    const observedFieldNames = String(observedField)
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean);

    const readValue = (name: string) => {
      const fieldType = sdk.contentType.fields.find((f) => f.id === name)?.type;
      const raw = sdk.entry.fields[name].getValue();
      return fieldType === 'RichText' ? documentToHtmlString(raw) : raw ?? '';
    };

    const readObservedValues = () => observedFieldNames.map(readValue);

    let baselineValues = readObservedValues();
    let baselinePublishedVersion = sdk.entry.getSys().publishedCounter;

    const unsubscribe = sdk.entry.onSysChanged(async (sys: EntrySys) => {
      if (cancelled) return;
      const currentPublishedVersion = sys.publishedCounter;
      const currentValues = readObservedValues();
      const anyChanged = currentValues.some(
        (value, index) => value !== baselineValues[index],
      );
      const anyPresent = currentValues.some(Boolean);

      if (
        currentPublishedVersion &&
        baselinePublishedVersion &&
        currentPublishedVersion > baselinePublishedVersion &&
        anyChanged
      ) {
        const newValue = anyPresent ? sys.publishedAt : undefined;
        setField(newValue);
        if (newValue === undefined) {
          await sdk.field.removeValue();
        } else {
          await sdk.field.setValue(newValue);
        }
        await sdk.entry.publish();
        baselineValues = currentValues;
        baselinePublishedVersion = sdk.entry.getSys().publishedCounter;
      }
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, [sdk]);

  return <Paragraph>{field}</Paragraph>;
};

export default Field;
