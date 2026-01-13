import { FieldAppSDK } from '@contentful/app-sdk';
import { Note, Stack } from '@contentful/f36-components';
import { DateEditor } from '@contentful/field-editor-date';
import { SingleEntryReferenceEditor } from '@contentful/field-editor-reference';
import { useSDK } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState, useCallback } from 'react';
import { getEntry, onEntryChanged } from '../utils';

export const TEAM_RESEARCH_THEME_WARNING =
  'Discovery teams require a Research Theme';
export const PROJECT_END_DATE_WARNING =
  'Closed or Completed projects require an End Date';
export const PROJECT_RESOURCE_TYPE_WARNING =
  'Resource Projects require a Resource Type';

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
  const [warning, setWarning] = useState<string | null>(null);

  const validateField = useCallback(() => {
    const entry = getEntry(sdk);
    const contentTypeId = sdk.contentType.sys.id;
    const fieldId = sdk.field.id;

    let newWarning: string | null = null;
    let isInvalid = false;

    if (contentTypeId === 'teams' && fieldId === 'researchTheme') {
      const teamType = entry.fields.teamType;
      const researchTheme = entry.fields.researchTheme;

      if (teamType === 'Discovery Team' && !researchTheme) {
        newWarning = TEAM_RESEARCH_THEME_WARNING;
        isInvalid = true;
      }
    }

    if (contentTypeId === 'projects' && fieldId === 'endDate') {
      const status = entry.fields.status;
      const endDate = entry.fields.endDate;

      if ((status === 'Closed' || status === 'Completed') && !endDate) {
        newWarning = PROJECT_END_DATE_WARNING;
        isInvalid = true;
      }
    }

    if (contentTypeId === 'projects' && fieldId === 'resourceType') {
      const projectType = entry.fields.projectType;
      const resourceType = entry.fields.resourceType;

      if (projectType === 'Resource Project' && !resourceType) {
        newWarning = PROJECT_RESOURCE_TYPE_WARNING;
        isInvalid = true;
      }
    }

    setWarning(newWarning);
    sdk.field.setInvalid(isInvalid);
  }, [sdk]);

  useEffect(() => {
    if (warning) {
      sdk.notifier.error(warning);
    }
  }, [warning]);

  useEffect(() => {
    const unsubscribe = onEntryChanged(sdk, validateField);
    validateField();
    return unsubscribe;
  }, [sdk, validateField]);

  // Dynamic height management for date picker
  useEffect(() => {
    if (sdk.field.type !== 'Date') {
      sdk.window.startAutoResizer();
      return () => sdk.window.stopAutoResizer();
    }

    // Set initial compact height for date field
    const compactHeight = warning ? 120 : 40;
    const expandedHeight = 370;

    sdk.window.updateHeight(compactHeight);
    let isPickerCurrentlyOpen = false;

    // Watch for picker opening/closing
    const observer = new MutationObserver((mutations) => {
      // Check multiple possible selectors for the date picker
      const picker =
        document.querySelector('[data-test-id="date-picker"]') ||
        document.querySelector('[role="dialog"]') ||
        document.querySelector('.cf-date-picker-popper') ||
        document.querySelector('[data-radix-popper-content-wrapper]');

      if (picker) {
        const ariaHidden = picker.getAttribute('aria-hidden');
        const dataState = picker.getAttribute('data-state');
        const style = window.getComputedStyle(picker);
        const isVisible =
          style.display !== 'none' && style.visibility !== 'hidden';

        // Picker is open if aria-hidden is "false" or data-state is "open" or if it's visible
        const isPickerOpen =
          ariaHidden === 'false' ||
          dataState === 'open' ||
          (ariaHidden === null && dataState === null && isVisible);

        // Only update if state changed
        if (isPickerOpen !== isPickerCurrentlyOpen) {
          isPickerCurrentlyOpen = isPickerOpen;
          const newHeight = isPickerOpen ? expandedHeight : compactHeight;
          sdk.window.updateHeight(newHeight);
        }
      } else if (isPickerCurrentlyOpen) {
        // Picker was removed from DOM, so it's closed
        isPickerCurrentlyOpen = false;
        sdk.window.updateHeight(compactHeight);
      }
    });

    // Handle clicks outside to close picker
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const picker =
        document.querySelector('[data-test-id="date-picker"]') ||
        document.querySelector('[role="dialog"]') ||
        document.querySelector('.cf-date-picker-popper') ||
        document.querySelector('[data-radix-popper-content-wrapper]');

      const dateButton = target.closest(
        '[data-test-id="cf-ui-datepicker-button"]',
      );

      // If clicking outside both the picker and the button, close it
      if (picker && !picker.contains(target) && !dateButton) {
        setTimeout(() => {
          if (isPickerCurrentlyOpen) {
            isPickerCurrentlyOpen = false;
            sdk.window.updateHeight(compactHeight);
          }
        }, 100);
      }
    };

    // Observe the entire document for changes
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ['aria-hidden', 'style', 'class', 'data-state'],
    });

    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [sdk.field.type, sdk.window, warning]);

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
