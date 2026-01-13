import { FieldAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import Field, {
  TEAM_RESEARCH_THEME_WARNING,
  PROJECT_END_DATE_WARNING,
  PROJECT_RESOURCE_TYPE_WARNING,
} from '../../locations/Field';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

jest.mock('@contentful/field-editor-date', () => ({
  DateEditor: () => <div data-testid="date-editor">Date Editor</div>,
}));

jest.mock('@contentful/field-editor-reference', () => ({
  SingleEntryReferenceEditor: () => (
    <div data-testid="reference-editor">Reference Editor</div>
  ),
}));

const unsubscribeFn = jest.fn();

const createMockField = (getValue: () => unknown) => {
  let callback: (() => void) | null = null;
  return {
    id: 'mockField',
    getValue: jest.fn(getValue),
    onValueChanged: jest.fn((cb: () => void) => {
      callback = cb;
      setTimeout(() => callback?.(), 0);
      return unsubscribeFn;
    }),
    triggerChange: () => callback?.(),
  };
};

const mockBaseSdk = (
  contentTypeId: string,
  fieldId: string,
  fieldType: 'Date' | 'Link' | 'Text' | 'Symbol' = 'Link',
) => {
  const fields: Record<string, ReturnType<typeof createMockField>> = {
    teamType: createMockField(() => null),
    researchTheme: createMockField(() => null),
    status: createMockField(() => null),
    endDate: createMockField(() => null),
    projectType: createMockField(() => null),
    resourceType: createMockField(() => null),
  };

  Object.keys(fields).forEach((key) => {
    fields[key].id = key;
  });

  return {
    field: {
      id: fieldId,
      type: fieldType,
      linkType: fieldType === 'Link' ? 'Entry' : undefined,
      setValue: jest.fn(),
      getValue: jest.fn(() => null),
      setInvalid: jest.fn(),
    },
    contentType: {
      sys: {
        id: contentTypeId,
      },
    },
    entry: {
      getSys: jest.fn(() => ({
        id: 'entry-1',
      })),
      getMetadata: jest.fn(() => ({})),
      onSysChanged: jest.fn((cb: () => void) => {
        setTimeout(() => cb(), 0);
        return unsubscribeFn;
      }),
      onMetadataChanged: jest.fn(() => unsubscribeFn),
      fields,
    },
    notifier: {
      error: jest.fn(),
    },
    window: {
      updateHeight: jest.fn(),
      startAutoResizer: jest.fn(),
      stopAutoResizer: jest.fn(),
    },
  };
};

describe('Field component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('height management', () => {
    it('uses auto resizer for non-date and non-entry-link fields', async () => {
      const sdk = mockBaseSdk(
        'teams',
        'researchTheme',
        'Text',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(sdk.window.startAutoResizer).toHaveBeenCalled();
      });
    });

    it('uses custom height management for entry link fields', async () => {
      const sdk = mockBaseSdk(
        'teams',
        'researchTheme',
        'Link',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (sdk.field as any).linkType = 'Entry';
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(sdk.window.updateHeight).toHaveBeenCalledWith(80);
        expect(sdk.window.startAutoResizer).not.toHaveBeenCalled();
      });
    });

    it('sets adjusted height for entry link fields with warning', async () => {
      const sdk = mockBaseSdk(
        'teams',
        'researchTheme',
        'Link',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (sdk.field as any).linkType = 'Entry';
      (sdk.entry.fields.teamType as any).getValue = jest.fn(
        () => 'Discovery Team',
      );
      (sdk.entry.fields.researchTheme as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(sdk.window.updateHeight).toHaveBeenCalledWith(120);
      });
    });

    it('sets initial compact height for date fields', async () => {
      const sdk = mockBaseSdk(
        'projects',
        'endDate',
        'Date',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(sdk.window.updateHeight).toHaveBeenCalledWith(40);
      });
    });

    it('sets adjusted height for date fields with warning', async () => {
      const sdk = mockBaseSdk(
        'projects',
        'endDate',
        'Date',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (sdk.entry.fields.status as any).getValue = jest.fn(() => 'Closed');
      (sdk.entry.fields.endDate as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(sdk.window.updateHeight).toHaveBeenCalledWith(120);
      });
    });
  });

  describe('teams validation', () => {
    it('shows warning for Discovery Team without Research Theme', async () => {
      const sdk = mockBaseSdk(
        'teams',
        'researchTheme',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (sdk.entry.fields.teamType as any).getValue = jest.fn(
        () => 'Discovery Team',
      );
      (sdk.entry.fields.researchTheme as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(
          screen.getByText(TEAM_RESEARCH_THEME_WARNING),
        ).toBeInTheDocument();
        expect(sdk.field.setInvalid).toHaveBeenCalledWith(true);
        expect(sdk.notifier.error).toHaveBeenCalledWith(
          TEAM_RESEARCH_THEME_WARNING,
        );
      });
    });

    it('clears warning when Research Theme is provided', async () => {
      const sdk = mockBaseSdk(
        'teams',
        'researchTheme',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (sdk.entry.fields.teamType as any).getValue = jest.fn(
        () => 'Discovery Team',
      );
      (sdk.entry.fields.researchTheme as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(
          screen.getByText(TEAM_RESEARCH_THEME_WARNING),
        ).toBeInTheDocument();
      });

      (sdk.entry.fields.researchTheme as any).getValue = jest.fn(
        () => 'Some Theme',
      );
      (sdk.entry.fields.researchTheme as any).triggerChange();

      await waitFor(() => {
        expect(screen.queryByText(TEAM_RESEARCH_THEME_WARNING)).toBeNull();
        expect(sdk.field.setInvalid).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('projects validation', () => {
    it.each(['Closed', 'Completed'])(
      'shows warning for %s project without End Date',
      async (status) => {
        const sdk = mockBaseSdk(
          'projects',
          'endDate',
          'Date',
        ) as unknown as jest.Mocked<FieldAppSDK>;
        (sdk.entry.fields.status as any).getValue = jest.fn(() => status);
        (sdk.entry.fields.endDate as any).getValue = jest.fn(() => null);
        (useSDK as jest.Mock).mockReturnValue(sdk);

        render(<Field />);
        await waitFor(() => {
          expect(
            screen.getByText(PROJECT_END_DATE_WARNING),
          ).toBeInTheDocument();
          expect(sdk.field.setInvalid).toHaveBeenCalledWith(true);
        });
      },
    );

    it('shows warning for Resource Project without Resource Type', async () => {
      const sdk = mockBaseSdk(
        'projects',
        'resourceType',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (sdk.entry.fields.projectType as any).getValue = jest.fn(
        () => 'Resource Project',
      );
      (sdk.entry.fields.resourceType as any).getValue = jest.fn(() => null);
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(
          screen.getByText(PROJECT_RESOURCE_TYPE_WARNING),
        ).toBeInTheDocument();
        expect(sdk.field.setInvalid).toHaveBeenCalledWith(true);
      });
    });
  });

  describe('skips validation', () => {
    it('when conditions are not met', async () => {
      const sdk = mockBaseSdk(
        'teams',
        'researchTheme',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (sdk.entry.fields.teamType as any).getValue = jest.fn(
        () => 'Regular Team',
      );
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(screen.queryByText(TEAM_RESEARCH_THEME_WARNING)).toBeNull();
        expect(sdk.field.setInvalid).toHaveBeenCalledWith(false);
        expect(sdk.notifier.error).not.toHaveBeenCalled();
      });
    });

    it('for non-matching content type or field', async () => {
      const sdk = mockBaseSdk(
        'otherContentType',
        'someOtherField',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(sdk.field.setInvalid).toHaveBeenCalledWith(false);
      });
    });
  });
});
