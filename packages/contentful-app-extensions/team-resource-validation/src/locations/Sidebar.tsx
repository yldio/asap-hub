import { SidebarAppSDK } from '@contentful/app-sdk';
import { Note, Stack, Text } from '@contentful/f36-components';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState } from 'react';
import { getEntry, onEntryChanged } from '../utils';

export const TEAM_RESOURCE_FIELDS_WARNING =
  'If you populate any Resource fields, please complete Resource Title, Resource Description, Resource Button Copy, and Resource Contact Email. (Resource Link is optional.)';

interface Warning {
  id: string;
  message: string;
  fieldId: string;
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

const Sidebar = () => {
  const sdk = useSDK<SidebarAppSDK>();
  useAutoResizer();
  const [warnings, setWarnings] = useState<Warning[]>([]);

  useEffect(
    () =>
      onEntryChanged(sdk, () => {
        const entry = getEntry(sdk);
        const contentTypeId = sdk.contentType.sys.id;

        const newWarnings: Warning[] = [];

        if (contentTypeId === 'teams') {
          const requiredResourceFields = [
            { id: 'resourceTitle', value: entry.fields.resourceTitle },
            {
              id: 'resourceDescription',
              value: entry.fields.resourceDescription,
            },
            {
              id: 'resourceButtonCopy',
              value: entry.fields.resourceButtonCopy,
            },
            {
              id: 'resourceContactEmail',
              value: entry.fields.resourceContactEmail,
            },
          ] as const;

          const anyRequiredResourceFieldPopulated = requiredResourceFields.some(
            ({ value }) => isPopulated(value),
          );
          const allRequiredResourceFieldsPopulated =
            requiredResourceFields.every(({ value }) => isPopulated(value));

          if (
            anyRequiredResourceFieldPopulated &&
            !allRequiredResourceFieldsPopulated
          ) {
            const firstMissingField =
              requiredResourceFields.find(({ value }) => !isPopulated(value))
                ?.id ?? 'resourceTitle';

            newWarnings.push({
              id: 'team-resource-fields',
              message: TEAM_RESOURCE_FIELDS_WARNING,
              fieldId: firstMissingField,
            });
          }
        }

        setWarnings(newWarnings);
      }),
    [sdk],
  );

  const focusField = (fieldId: string) => {
    sdk.navigator.openEntry(sdk.entry.getSys().id, { slideIn: false });
  };

  if (warnings.length === 0) {
    return <Text fontColor="gray500">No additional validation warnings.</Text>;
  }

  return (
    <Stack flexDirection="column" spacing="spacingS">
      {warnings.map((warning: Warning) => (
        <Note
          key={warning.id}
          variant="warning"
          onClick={() => focusField(warning.fieldId)}
        >
          {warning.message}
        </Note>
      ))}
    </Stack>
  );
};

export default Sidebar;
