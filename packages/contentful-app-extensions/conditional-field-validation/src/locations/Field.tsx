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

  // Dynamic height management for date picker and entry reference editor
  useEffect(() => {
    const fieldType = sdk.field.type;
    const isDateField = fieldType === 'Date';
    const isEntryLinkField =
      fieldType === 'Link' &&
      'linkType' in sdk.field &&
      sdk.field.linkType === 'Entry';

    // Use auto resizer for other field types
    if (!isDateField && !isEntryLinkField) {
      sdk.window.startAutoResizer();
      return () => sdk.window.stopAutoResizer();
    }

    // Set initial compact height
    const compactHeight = warning ? 120 : isDateField ? 40 : 80;
    const expandedHeight = isDateField ? 370 : 110; // Adjust for entry reference menu

    sdk.window.updateHeight(compactHeight);
    let isMenuCurrentlyOpen = false;

    // Watch for menu/picker opening/closing
    const observer = new MutationObserver(() => {
      let isMenuOpen = false;

      if (isDateField) {
        // Date picker detection
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

          isMenuOpen =
            ariaHidden === 'false' ||
            dataState === 'open' ||
            (ariaHidden === null && dataState === null && isVisible);
        }
      } else if (isEntryLinkField) {
        // Entry reference editor menu detection
        // Look for dropdown menus, popovers, or action menus
        const menu =
          document.querySelector('[role="menu"]') ||
          document.querySelector('[role="listbox"]') ||
          document.querySelector('[data-radix-popper-content-wrapper]') ||
          document.querySelector('.cf-ui-dropdown') ||
          document.querySelector('[class*="Dropdown"]') ||
          document.querySelector('[class*="Menu"]') ||
          document.querySelector('[class*="Popover"]');

        if (menu) {
          const ariaHidden = menu.getAttribute('aria-hidden');
          const dataState = menu.getAttribute('data-state');
          const style = window.getComputedStyle(menu);
          const isVisible =
            style.display !== 'none' &&
            style.visibility !== 'hidden' &&
            style.opacity !== '0';

          isMenuOpen =
            ariaHidden === 'false' ||
            dataState === 'open' ||
            (ariaHidden === null && dataState === null && isVisible);
        }
      }

      // Only update if state changed
      if (isMenuOpen !== isMenuCurrentlyOpen) {
        isMenuCurrentlyOpen = isMenuOpen;
        const newHeight = isMenuOpen ? expandedHeight : compactHeight;
        sdk.window.updateHeight(newHeight);
      }
    });

    // Handle clicks outside to close menu
    const handleDocumentClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (isDateField) {
        const picker =
          document.querySelector('[data-test-id="date-picker"]') ||
          document.querySelector('[role="dialog"]') ||
          document.querySelector('.cf-date-picker-popper') ||
          document.querySelector('[data-radix-popper-content-wrapper]');

        const dateButton = target.closest(
          '[data-test-id="cf-ui-datepicker-button"]',
        );

        if (picker && !picker.contains(target) && !dateButton) {
          setTimeout(() => {
            if (isMenuCurrentlyOpen) {
              isMenuCurrentlyOpen = false;
              sdk.window.updateHeight(compactHeight);
            }
          }, 100);
        }
      } else if (isEntryLinkField) {
        // Check if click is outside the menu and not on a trigger button
        const menu =
          document.querySelector('[role="menu"]') ||
          document.querySelector('[role="listbox"]') ||
          document.querySelector('[data-radix-popper-content-wrapper]') ||
          document.querySelector('.cf-ui-dropdown');

        const triggerButton =
          target.closest('[aria-haspopup="true"]') ||
          target.closest('button[aria-expanded]');

        if (menu && !menu.contains(target) && !triggerButton) {
          setTimeout(() => {
            if (isMenuCurrentlyOpen) {
              isMenuCurrentlyOpen = false;
              sdk.window.updateHeight(compactHeight);
            }
          }, 100);
        }
      }
    };

    // Observe the entire document for changes
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: [
        'aria-hidden',
        'style',
        'class',
        'data-state',
        'aria-expanded',
      ],
    });

    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      observer.disconnect();
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [
    sdk.field.type,
    'linkType' in sdk.field ? sdk.field.linkType : undefined,
    sdk.window,
    warning,
  ]);

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

    if (
      fieldType === 'Link' &&
      'linkType' in sdk.field &&
      sdk.field.linkType === 'Entry'
    ) {
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
