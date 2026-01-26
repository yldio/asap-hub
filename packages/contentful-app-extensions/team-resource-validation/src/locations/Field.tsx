import { FieldAppSDK } from '@contentful/app-sdk';
import { Note, Stack } from '@contentful/f36-components';
import { MultipleLineEditor } from '@contentful/field-editor-multiple-line';
import { SingleLineEditor } from '@contentful/field-editor-single-line';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState, useCallback } from 'react';
import { getEntry, onEntryChanged } from '../utils';
import { TEAM_RESOURCE_FIELDS_WARNING } from './Sidebar';

interface ValidationResult {
  warning: string | null;
  isInvalid: boolean;
}

const isPopulated = (value: unknown): boolean => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  if (Array.isArray(value)) return value.length > 0;
  return true;
};

const validateResourceFields = (
  entry: ReturnType<typeof getEntry>,
): ValidationResult => {
  const requiredResourceFields = [
    { id: 'resourceTitle', value: entry.fields.resourceTitle },
    { id: 'resourceDescription', value: entry.fields.resourceDescription },
    { id: 'resourceButtonCopy', value: entry.fields.resourceButtonCopy },
    { id: 'resourceContactEmail', value: entry.fields.resourceContactEmail },
  ] as const;

  const anyRequiredResourceFieldPopulated = requiredResourceFields.some(
    ({ value }) => isPopulated(value),
  );
  const allRequiredResourceFieldsPopulated = requiredResourceFields.every(
    ({ value }) => isPopulated(value),
  );

  if (
    anyRequiredResourceFieldPopulated &&
    !allRequiredResourceFieldsPopulated
  ) {
    return {
      warning: TEAM_RESOURCE_FIELDS_WARNING,
      isInvalid: false, // Don't block publishing, just show warning
    };
  }

  return { warning: null, isInvalid: false };
};

const getFieldName = (fieldId: string): string => {
  const fieldNames: Record<string, string> = {
    resourceTitle: 'Resource Title',
    resourceDescription: 'Resource Description',
    resourceButtonCopy: 'Resource Button Copy',
    resourceContactEmail: 'Resource Contact Email',
  };
  return fieldNames[fieldId] || fieldId;
};

const getFieldValidation = (
  contentTypeId: string,
  fieldId: string,
  entry: ReturnType<typeof getEntry>,
): ValidationResult => {
  // Only validate Resource fields on Teams content type
  if (contentTypeId === 'teams') {
    const resourceFieldIds = [
      'resourceTitle',
      'resourceDescription',
      'resourceButtonCopy',
      'resourceContactEmail',
    ];

    if (resourceFieldIds.includes(fieldId)) {
      // Check if any Resource field is populated
      const requiredResourceFields = [
        { id: 'resourceTitle', value: entry.fields.resourceTitle },
        { id: 'resourceDescription', value: entry.fields.resourceDescription },
        { id: 'resourceButtonCopy', value: entry.fields.resourceButtonCopy },
        {
          id: 'resourceContactEmail',
          value: entry.fields.resourceContactEmail,
        },
      ] as const;

      const anyRequiredResourceFieldPopulated = requiredResourceFields.some(
        ({ value }) => isPopulated(value),
      );

      // Only show warning if:
      // 1. At least one Resource field is populated (user started adding Resource info)
      // 2. The current field is NOT populated (this specific field is empty)
      const currentField = requiredResourceFields.find(
        ({ id }) => id === fieldId,
      );
      const isCurrentFieldEmpty = currentField
        ? !isPopulated(currentField.value)
        : false;

      if (anyRequiredResourceFieldPopulated && isCurrentFieldEmpty) {
        // Show field-specific warning message
        const fieldName = getFieldName(fieldId);
        return {
          warning: `${fieldName} is required when adding Resource information.`,
          isInvalid: false,
        };
      }
    }
  }

  return { warning: null, isInvalid: false };
};

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  useAutoResizer();
  const [warning, setWarning] = useState<string | null>(null);

  const validateField = useCallback(() => {
    const entry = getEntry(sdk);
    const contentTypeId = sdk.contentType.sys.id;
    const fieldId = sdk.field.id;

    const { warning: newWarning, isInvalid } = getFieldValidation(
      contentTypeId,
      fieldId,
      entry,
    );

    setWarning(newWarning);
    sdk.field.setInvalid(isInvalid);
  }, [sdk]);

  useEffect(() => {
    const unsubscribe = onEntryChanged(sdk, validateField);
    validateField();
    return unsubscribe;
  }, [sdk, validateField]);

  const renderFieldEditor = () => {
    const fieldType = sdk.field.type;

    if (fieldType === 'Symbol') {
      return (
        <div style={{ width: '100%' }}>
          <SingleLineEditor
            field={sdk.field}
            locales={sdk.locales}
            isInitiallyDisabled={false}
          />
        </div>
      );
    }

    if (fieldType === 'Text') {
      return (
        <div style={{ width: '100%' }}>
          <MultipleLineEditor
            field={sdk.field}
            locales={sdk.locales}
            isInitiallyDisabled={false}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <Stack flexDirection="column" spacing="spacingS" alignItems="flex-start">
      {renderFieldEditor()}
      {warning && <Note variant="warning">{warning}</Note>}
    </Stack>
  );
};

export default Field;
