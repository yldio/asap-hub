import { FieldAppSDK } from '@contentful/app-sdk';
import { Stack } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';
import React from 'react';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();

  const renderFieldEditor = () => {
    const fieldType = sdk.field.type;
    const fieldId = sdk.field.id;
    const fieldName = sdk.field.name;

    // eslint-disable-next-line no-console
    console.log({
      fieldType,
      fieldId,
      fieldName,
    });

    if (fieldType === 'Text' && fieldId === 'role') {
      return (
        <div style={{ width: '100%' }}>
          should be a custom field for role selection
        </div>
      );
    }

    return null;
  };

  return (
    <Stack flexDirection="column" spacing="spacingS" alignItems="flex-start">
      {renderFieldEditor()}
    </Stack>
  );
};

export default Field;
