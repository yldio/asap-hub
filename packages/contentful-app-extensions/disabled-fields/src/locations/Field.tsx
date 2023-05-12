import React, { useEffect } from 'react';
import { Paragraph, Stack, Text, Radio } from '@contentful/f36-components';
import { FieldExtensionSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();

  useEffect(() => {
    sdk.window.startAutoResizer();
  }, [sdk.window]);

  if (sdk.field.type === 'Object') {
    return (
      <Text as={'pre'}>{JSON.stringify(sdk.field.getValue(), null, 2)}</Text>
    );
  }

  if (sdk.field.type === 'Boolean') {
    const booleanValue = sdk.field.getValue();
    return (
      <Stack flexDirection="row">
        <Radio
          id="radio1"
          name="radio-1"
          value="yes"
          isChecked={booleanValue === true}
          isDisabled
        >
          Yes
        </Radio>
        <Radio
          id="radio2"
          name="radio-2"
          value="no"
          isChecked={booleanValue === false}
          isDisabled
        >
          No
        </Radio>
      </Stack>
    );
  }

  if (sdk.field.type === 'RichText') {
    return <Text>{documentToReactComponents(sdk.field.getValue())}</Text>;
  }

  return <Paragraph>{sdk.field.getValue()}</Paragraph>;
};

export default Field;
