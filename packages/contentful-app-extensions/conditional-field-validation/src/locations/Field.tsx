import { FieldAppSDK } from '@contentful/app-sdk';
import { Note, Stack } from '@contentful/f36-components';
import { DateEditor } from '@contentful/field-editor-date';
import { SingleEntryReferenceEditor } from '@contentful/field-editor-reference';
import { useSDK } from '@contentful/react-apps-toolkit';
import React, { useEffect, useState, useCallback } from 'react';
import { getEntry, onEntryChanged } from '../utils';

export const TEAM_RESEARCH_THEME_WARNING =
  'Discovery teams require a Research Theme';
export const TEAM_RESOURCE_FIELDS_WARNING =
  'If you populate any Resource fields, please complete Resource Title, Resource Description, Resource Button Copy, and Resource Contact Email. (Resource Link is optional.)';
export const PROJECT_END_DATE_WARNING =
  'Closed or Completed projects require an End Date';
export const PROJECT_RESOURCE_TYPE_WARNING =
  'Resource Projects require a Resource Type';

const HEIGHTS = {
  DATE_COMPACT: 40,
  DATE_EXPANDED: 370,
  LINK_COMPACT: 80,
  LINK_EXPANDED: 110,
  WARNING_OFFSET: 40,
} as const;

interface ValidationResult {
  warning: string | null;
  isInvalid: boolean;
}

const validateResearchTheme = (
  teamType: string | null,
  researchTheme: string | null,
): ValidationResult => {
  if (teamType === 'Discovery Team' && !researchTheme) {
    return {
      warning: TEAM_RESEARCH_THEME_WARNING,
      isInvalid: true,
    };
  }
  return { warning: null, isInvalid: false };
};

const validateEndDate = (
  status: string | null,
  endDate: string | null,
): ValidationResult => {
  if ((status === 'Closed' || status === 'Completed') && !endDate) {
    return {
      warning: PROJECT_END_DATE_WARNING,
      isInvalid: true,
    };
  }
  return { warning: null, isInvalid: false };
};

const validateResourceType = (
  projectType: string | null,
  resourceType: string | null,
): ValidationResult => {
  if (projectType === 'Resource Project' && !resourceType) {
    return {
      warning: PROJECT_RESOURCE_TYPE_WARNING,
      isInvalid: true,
    };
  }
  return { warning: null, isInvalid: false };
};

const getFieldValidation = (
  contentTypeId: string,
  fieldId: string,
  entry: ReturnType<typeof getEntry>,
): ValidationResult => {
  if (contentTypeId === 'teams' && fieldId === 'researchTheme') {
    return validateResearchTheme(
      entry.fields.teamType,
      entry.fields.researchTheme,
    );
  }

  if (contentTypeId === 'projects' && fieldId === 'endDate') {
    return validateEndDate(entry.fields.status, entry.fields.endDate);
  }

  if (contentTypeId === 'projects' && fieldId === 'resourceType') {
    return validateResourceType(
      entry.fields.projectType,
      entry.fields.resourceType,
    );
  }

  return { warning: null, isInvalid: false };
};

const getDatePickerElement = (): Element | null => {
  return (
    document.querySelector('[data-test-id="date-picker"]') ||
    document.querySelector('[role="dialog"]') ||
    document.querySelector('.cf-date-picker-popper') ||
    document.querySelector('[data-radix-popper-content-wrapper]')
  );
};

const getEntryLinkMenuElement = (): Element | null => {
  return (
    document.querySelector('[role="menu"]') ||
    document.querySelector('[role="listbox"]') ||
    document.querySelector('[data-radix-popper-content-wrapper]') ||
    document.querySelector('.cf-ui-dropdown') ||
    document.querySelector('[class*="Dropdown"]') ||
    document.querySelector('[class*="Menu"]') ||
    document.querySelector('[class*="Popover"]')
  );
};

const isElementVisible = (element: Element): boolean => {
  const ariaHidden = element.getAttribute('aria-hidden');
  const dataState = element.getAttribute('data-state');
  const style = window.getComputedStyle(element);
  const isVisible =
    style.display !== 'none' &&
    style.visibility !== 'hidden' &&
    style.opacity !== '0';

  return (
    ariaHidden === 'false' ||
    dataState === 'open' ||
    (ariaHidden === null && dataState === null && isVisible)
  );
};

const isDatePickerOpen = (): boolean => {
  const picker = getDatePickerElement();
  return picker ? isElementVisible(picker) : false;
};

const isEntryLinkMenuOpen = (): boolean => {
  const menu = getEntryLinkMenuElement();
  return menu ? isElementVisible(menu) : false;
};

const createHeightManager = (
  sdk: FieldAppSDK,
  isDateField: boolean,
  isEntryLinkField: boolean,
  warning: string | null,
) => {
  const compactHeight = warning
    ? HEIGHTS.LINK_COMPACT + HEIGHTS.WARNING_OFFSET
    : isDateField
      ? HEIGHTS.DATE_COMPACT
      : HEIGHTS.LINK_COMPACT;
  const expandedHeight = isDateField
    ? HEIGHTS.DATE_EXPANDED
    : HEIGHTS.LINK_EXPANDED;

  let isMenuCurrentlyOpen = false;

  const updateHeight = (isOpen: boolean) => {
    if (isOpen !== isMenuCurrentlyOpen) {
      isMenuCurrentlyOpen = isOpen;
      sdk.window.updateHeight(isOpen ? expandedHeight : compactHeight);
    }
  };

  const checkMenuState = () => {
    const isOpen = isDateField ? isDatePickerOpen() : isEntryLinkMenuOpen();
    updateHeight(isOpen);
  };

  const handleDocumentClick = (e: MouseEvent) => {
    const target = e.target as HTMLElement;

    if (isDateField) {
      const picker = getDatePickerElement();
      const dateButton = target.closest(
        '[data-test-id="cf-ui-datepicker-button"]',
      );

      if (picker && !picker.contains(target) && !dateButton) {
        setTimeout(() => {
          if (isMenuCurrentlyOpen) {
            updateHeight(false);
          }
        }, 100);
      }
    } else if (isEntryLinkField) {
      const menu = getEntryLinkMenuElement();
      const triggerButton =
        target.closest('[aria-haspopup="true"]') ||
        target.closest('button[aria-expanded]');

      if (menu && !menu.contains(target) && !triggerButton) {
        setTimeout(() => {
          if (isMenuCurrentlyOpen) {
            updateHeight(false);
          }
        }, 100);
      }
    }
  };

  return { checkMenuState, handleDocumentClick, compactHeight };
};

const Field = () => {
  const sdk = useSDK<FieldAppSDK>();
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
    if (warning) {
      sdk.notifier.error(warning);
    }
  }, [sdk.notifier, warning]);

  useEffect(() => {
    const unsubscribe = onEntryChanged(sdk, validateField);
    validateField();
    return unsubscribe;
  }, [sdk, validateField]);

  useEffect(() => {
    const fieldType = sdk.field.type;
    const isDateField = fieldType === 'Date';
    const isEntryLinkField =
      fieldType === 'Link' &&
      'linkType' in sdk.field &&
      sdk.field.linkType === 'Entry';

    if (!isDateField && !isEntryLinkField) {
      sdk.window.startAutoResizer();
      return () => sdk.window.stopAutoResizer();
    }

    const { checkMenuState, handleDocumentClick, compactHeight } =
      createHeightManager(sdk, isDateField, isEntryLinkField, warning);

    sdk.window.updateHeight(compactHeight);

    const observer = new MutationObserver(checkMenuState);

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
        <div style={{ width: '100%' }}>
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
        </div>
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
