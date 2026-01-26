import { FieldAppSDK } from '@contentful/app-sdk';
import { useSDK, useAutoResizer } from '@contentful/react-apps-toolkit';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';

import Field from '../../locations/Field';
import { TEAM_RESOURCE_FIELDS_WARNING } from '../../locations/Sidebar';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
}));

jest.mock('@contentful/field-editor-single-line', () => ({
  SingleLineEditor: () => (
    <div data-testid="single-line-editor">Single Line Editor</div>
  ),
}));

jest.mock('@contentful/field-editor-rich-text', () => ({
  RichTextEditor: () => (
    <div data-testid="rich-text-editor">Rich Text Editor</div>
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

const mockSdk = (
  contentTypeId: string,
  fieldId: string,
  fieldType: 'Symbol' | 'Text' | 'RichText' = 'Symbol',
) => {
  const fields: Record<string, ReturnType<typeof createMockField>> = {
    resourceTitle: createMockField(() => null),
    resourceDescription: createMockField(() => null),
    resourceButtonCopy: createMockField(() => null),
    resourceContactEmail: createMockField(() => null),
    resourceLink: createMockField(() => null),
  };

  Object.keys(fields).forEach((key) => {
    fields[key].id = key;
  });

  return {
    contentType: { sys: { id: contentTypeId } },
    field: {
      id: fieldId,
      type: fieldType,
      setInvalid: jest.fn(),
    },
    entry: {
      getSys: jest.fn(() => ({ id: 'entry-1' })),
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
      startAutoResizer: jest.fn(),
      stopAutoResizer: jest.fn(),
    },
  };
};

describe('Team resource validation field', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('enables automatic resizing', async () => {
    const sdk = mockSdk(
      'teams',
      'resourceTitle',
      'Symbol',
    ) as unknown as jest.Mocked<FieldAppSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);
    await waitFor(() => {
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('shows warning when one required Resource field is populated but not all are', async () => {
    const sdk = mockSdk(
      'teams',
      'resourceTitle',
      'Symbol',
    ) as unknown as jest.Mocked<FieldAppSDK>;
    (sdk.entry.fields.resourceTitle as any).getValue = jest.fn(
      () => 'Some title',
    );
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);
    await waitFor(() => {
      expect(
        screen.getByText(TEAM_RESOURCE_FIELDS_WARNING),
      ).toBeInTheDocument();
    });
  });

  it('does not show warning when all required Resource fields are populated', async () => {
    const sdk = mockSdk(
      'teams',
      'resourceTitle',
      'Symbol',
    ) as unknown as jest.Mocked<FieldAppSDK>;
    (sdk.entry.fields.resourceTitle as any).getValue = jest.fn(
      () => 'Some title',
    );
    (sdk.entry.fields.resourceDescription as any).getValue = jest.fn(
      () => 'Some description',
    );
    (sdk.entry.fields.resourceButtonCopy as any).getValue = jest.fn(
      () => 'Click',
    );
    (sdk.entry.fields.resourceContactEmail as any).getValue = jest.fn(
      () => 'test@example.com',
    );
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);
    await waitFor(() => {
      expect(
        screen.queryByText(TEAM_RESOURCE_FIELDS_WARNING),
      ).not.toBeInTheDocument();
    });
  });

  it('does not show warning for non-Resource fields', async () => {
    const sdk = mockSdk(
      'teams',
      'displayName',
      'Symbol',
    ) as unknown as jest.Mocked<FieldAppSDK>;
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);
    await waitFor(() => {
      expect(
        screen.queryByText(TEAM_RESOURCE_FIELDS_WARNING),
      ).not.toBeInTheDocument();
    });
  });

  it('does not show warning for non-Teams content types', async () => {
    const sdk = mockSdk(
      'projects',
      'resourceTitle',
      'Symbol',
    ) as unknown as jest.Mocked<FieldAppSDK>;
    (sdk.entry.fields.resourceTitle as any).getValue = jest.fn(
      () => 'Some title',
    );
    (useSDK as jest.Mock).mockReturnValue(sdk);

    render(<Field />);
    await waitFor(() => {
      expect(
        screen.queryByText(TEAM_RESOURCE_FIELDS_WARNING),
      ).not.toBeInTheDocument();
    });
  });
});
