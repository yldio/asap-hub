import { SidebarAppSDK } from '@contentful/app-sdk';
import { Note, Stack, Text } from '@contentful/f36-components';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState } from 'react';
import { getEntry, onEntryChanged } from '../utils';
import {
  TEAM_RESEARCH_THEME_WARNING,
  PROJECT_END_DATE_WARNING,
  PROJECT_RESOURCE_TYPE_WARNING,
} from './Field';

interface Warning {
  id: string;
  message: string;
  fieldId: string;
}

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

        // Teams validation
        if (contentTypeId === 'teams') {
          const teamType = entry.fields.teamType;
          const researchTheme = entry.fields.researchTheme;

          if (teamType === 'Discovery Team' && !researchTheme) {
            newWarnings.push({
              id: 'team-research-theme',
              message: TEAM_RESEARCH_THEME_WARNING,
              fieldId: 'researchTheme',
            });
          }
        }

        // Projects validation
        if (contentTypeId === 'projects') {
          const status = entry.fields.status;
          const endDate = entry.fields.endDate;
          const projectType = entry.fields.projectType;
          const resourceType = entry.fields.resourceType;

          if ((status === 'Closed' || status === 'Completed') && !endDate) {
            newWarnings.push({
              id: 'project-end-date',
              message: PROJECT_END_DATE_WARNING,
              fieldId: 'endDate',
            });
          }

          if (projectType === 'Resource Project' && !resourceType) {
            newWarnings.push({
              id: 'project-resource-type',
              message: PROJECT_RESOURCE_TYPE_WARNING,
              fieldId: 'resourceType',
            });
          }
        }

        setWarnings(newWarnings);
      }),
    [sdk],
  );

  const focusField = (fieldId: string) => {
    // Simply open/refresh the entry view
    // The SDK doesn't provide a native way to scroll to a specific field
    sdk.navigator.openEntry(sdk.entry.getSys().id, {
      slideIn: false,
    });
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
