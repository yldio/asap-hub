import { FieldAppSDK } from '@contentful/app-sdk';
import { Note, Stack } from '@contentful/f36-components';
import { DateEditor } from '@contentful/field-editor-date';
import { SingleEntryReferenceEditor } from '@contentful/field-editor-reference';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState } from 'react';
import { getEntry, onEntryChanged } from '../utils';

export const TEAM_RESEARCH_THEME_WARNING =
  'Discovery teams require a Research Theme';
export const PROJECT_END_DATE_WARNING =
  'Closed or Completed projects require an End Date';
export const PROJECT_RESOURCE_TYPE_WARNING =
  'Resource Projects require a Resource Type';

const Field = () => {
  useAutoResizer();

  const sdk = useSDK<FieldAppSDK>();
  const [warning, setWarning] = useState<string | null>(null);

  useEffect(() => {
    if (warning) {
      sdk.notifier.error('Please fill in the required field');
    }
  }, [sdk.notifier, warning]);
  useEffect(
    () =>
      onEntryChanged(sdk, () => {
        const entry = getEntry(sdk);
        const contentTypeId = sdk.contentType.sys.id;
        const fieldId = sdk.field.id;

        let newWarning: string | null = null;

        // Teams validation: researchTheme field
        if (contentTypeId === 'teams' && fieldId === 'researchTheme') {
          const teamType = entry.fields.teamType;
          const researchTheme = entry.fields.researchTheme;

          if (teamType === 'Discovery Team' && !researchTheme) {
            newWarning = TEAM_RESEARCH_THEME_WARNING;
            sdk.field.setInvalid(true);
          }
        }

        // Projects validation: endDate field
        if (contentTypeId === 'projects' && fieldId === 'endDate') {
          const status = entry.fields.status;
          const endDate = entry.fields.endDate;

          if ((status === 'Closed' || status === 'Completed') && !endDate) {
            newWarning = PROJECT_END_DATE_WARNING;
            sdk.field.setInvalid(true);
          }
        }

        // Projects validation: resourceType field
        if (contentTypeId === 'projects' && fieldId === 'resourceType') {
          const projectType = entry.fields.projectType;
          const resourceType = entry.fields.resourceType;

          if (projectType === 'Resource Project' && !resourceType) {
            newWarning = PROJECT_RESOURCE_TYPE_WARNING;
            sdk.field.setInvalid(true);
          }
        }

        setWarning(newWarning);
        sdk.field.setInvalid(newWarning !== null);
      }),
    [sdk],
  );

  // Render the default Contentful field editor (these are the official editors)
  const renderFieldEditor = () => {
    const fieldType = sdk.field.type;

    if (fieldType === 'Date') {
      return (
        <DateEditor
          field={sdk.field}
          parameters={{
            instance: {
              format: 'dateonly',
              ampm: '24',
            },
            installation: {},
            invocation: {},
          }}
        />
      );
    }

    if (fieldType === 'Link' && sdk.field.linkType === 'Entry') {
      return (
        <SingleEntryReferenceEditor
          sdk={sdk}
          viewType="link"
          hasCardEditActions={true}
          hasCardMoveActions={false}
          hasCardRemoveActions={true}
          parameters={{
            instance: {
              showLinkEntityAction: true,
              showCreateEntityAction: true,
            },
          }}
        />
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
