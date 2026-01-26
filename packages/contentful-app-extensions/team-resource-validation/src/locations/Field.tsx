import { FieldAppSDK } from '@contentful/app-sdk';
import { Note, Stack } from '@contentful/f36-components';
import { RichTextEditor } from '@contentful/field-editor-rich-text';
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
  // RichText field returns a Document object
  if (typeof value === 'object' && 'content' in value) {
    const doc = value as { content?: Array<{ content?: unknown[] }> };
    // Check if document has any content besides empty paragraphs
    return (
      doc.content?.some((node) => node.content && node.content.length > 0) ??
      false
    );
  }
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
      return validateResourceFields(entry);
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

    if (fieldType === 'RichText') {
      return (
        <div style={{ width: '100%' }}>
          <RichTextEditor sdk={sdk} isInitiallyDisabled={false} />
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
