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
  projectMemberValue: unknown = null,
  linkedEntryContentType: string | null = null,
) => {
  const fields: Record<string, ReturnType<typeof createMockField>> = {
    teamType: createMockField(() => null),
    researchTheme: createMockField(() => null),
    status: createMockField(() => null),
    endDate: createMockField(() => null),
    projectType: createMockField(() => null),
    resourceType: createMockField(() => null),
    projectMember: createMockField(() => projectMemberValue),
  };

  Object.keys(fields).forEach((key) => {
    fields[key].id = key;
  });

  return {
    field: {
      id: fieldId,
      type: 'Symbol',
      setValue: jest.fn(),
      getValue: jest.fn(() => null),
      setInvalid: jest.fn(),
      onValueChanged: jest.fn(() => unsubscribeFn),
      validations: [
        {
          in: [
            'Lead PI',
            'Co-PI',
            'Collaborating PI',
            'Project Manager',
            'Data Manager',
            'Staff Scientist',
            'ASAP Staff',
            'Trainee',
            'Trainee Project - Lead',
            'Trainee Project - Mentor',
            'Trainee Project - Key Personnel',
          ],
        },
      ],
      name: 'Role',
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
    space: {
      getEntry: jest.fn((id: string) =>
        Promise.resolve({
          sys: {
            id,
            contentType: {
              sys: {
                id: linkedEntryContentType,
              },
            },
          },
        }),
      ),
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

  describe('role field visibility', () => {
    it('shows enabled role field when project member is a user', async () => {
      const projectMemberValue = {
        sys: { id: 'user-123', type: 'Link', linkType: 'Entry' },
      };
      const sdk = mockBaseSdk(
        'projectMembership',
        'role',
        projectMemberValue,
        'users',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select).not.toBeDisabled();
        expect(sdk.window.startAutoResizer).toHaveBeenCalled();
      });
    });

    it('shows disabled role field when project member is a team', async () => {
      const projectMemberValue = {
        sys: { id: 'team-123', type: 'Link', linkType: 'Entry' },
      };
      const sdk = mockBaseSdk(
        'projectMembership',
        'role',
        projectMemberValue,
        'teams',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select).toBeDisabled();
        expect(sdk.window.startAutoResizer).toHaveBeenCalled();
      });
    });

    it('shows disabled role field when no project member is selected', async () => {
      const sdk = mockBaseSdk(
        'projectMembership',
        'role',
        null,
        null,
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();
        expect(select).toBeDisabled();
        expect(sdk.window.startAutoResizer).toHaveBeenCalled();
      });
    });

    it('displays all role options in the select dropdown', async () => {
      const projectMemberValue = {
        sys: { id: 'user-123', type: 'Link', linkType: 'Entry' },
      };
      const sdk = mockBaseSdk(
        'projectMembership',
        'role',
        projectMemberValue,
        'users',
      ) as unknown as jest.Mocked<FieldAppSDK>;
      (useSDK as jest.Mock).mockReturnValue(sdk);

      render(<Field />);
      await waitFor(() => {
        const select = screen.getByRole('combobox');
        expect(select).toBeInTheDocument();

        // Check that the options are present
        expect(screen.getByText('Lead PI')).toBeInTheDocument();
        expect(screen.getByText('Co-PI')).toBeInTheDocument();
        expect(screen.getByText('Collaborating PI')).toBeInTheDocument();
        expect(screen.getByText('Project Manager')).toBeInTheDocument();
      });
    });
  });
});
