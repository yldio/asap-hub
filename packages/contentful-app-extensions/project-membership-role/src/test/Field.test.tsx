import { FieldAppSDK } from '@contentful/app-sdk';
import { useSDK } from '@contentful/react-apps-toolkit';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import Field from '../locations/Field';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
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
      type: 'Text',
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

  describe('placeholder', () => {
    it('renders placeholder for role field', async () => {
      const sdk = mockBaseSdk(
        'project-membership',
        'role',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        expect(
          screen.getByText('should be a custom field for role selection'),
        ).toBeInTheDocument();
      });
    });
  });
});
