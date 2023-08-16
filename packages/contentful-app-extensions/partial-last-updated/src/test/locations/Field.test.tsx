import '@testing-library/jest-dom';
import React, { useState } from 'react';
import Field from '../../locations/Field';
import { act, render, screen, waitFor } from '@testing-library/react';

import {
  useSDK,
  useAutoResizer,
  useFieldValue,
} from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useAutoResizer: jest.fn(),
  useFieldValue: jest.fn(),
}));

describe('Field component', () => {
  beforeEach(() => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      parameters: {
        instance: {
          exclude: 'fieldOne, fieldTwo',
        },
      },
      field: {
        id: 'thisField',
      },
      entry: {
        fields: {
          fieldOne: {},
          fieldTwo: {},
          fieldThree: {},
          thisField: {},
        },
      },
    }));

    (useFieldValue as jest.Mock).mockImplementation((field) => {
      if (!field) {
        return useState('2023-04-12T16:05:00.000Z');
      }
      return useState(1);
    });

    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('enables automatic resizing', async () => {
    render(<Field />);
    await waitFor(() => {
      expect(useAutoResizer).toHaveBeenCalled();
    });
  });

  it('renders the field initial value', () => {
    render(<Field />);
    expect(screen.getByText('2023-04-12T16:05:00.000Z')).toBeInTheDocument();
  });

  it('updates to current timestamp if a non-excluded field changes', async () => {
    let setFieldValue = jest.fn();
    (useFieldValue as jest.Mock).mockImplementation((field) => {
      if (!field) {
        return useState('2023-04-12T16:05:00.000Z');
      }
      if (field === 'fieldThree') {
        const [value, _setFieldValue] = useState(1);
        return [value, setFieldValue.mockImplementation(_setFieldValue)];
      }
      return useState(1);
    });
    render(<Field />);
    await waitFor(() => {
      expect(screen.getByText('2023-04-12T16:05:00.000Z')).toBeInTheDocument();
    });
    act(() => {
      setFieldValue(2);
    });
    expect(screen.getByText(new Date().toISOString())).toBeInTheDocument();
  });

  it('does not update to current timestamp if an excluded field changes', async () => {
    let setFieldValue = jest.fn();
    (useFieldValue as jest.Mock).mockImplementation((field) => {
      if (!field) {
        return useState('2023-04-12T16:05:00.000Z');
      }
      if (field === 'fieldTwo') {
        const [value, _setFieldValue] = useState(1);
        return [value, setFieldValue.mockImplementation(_setFieldValue)];
      }
      return useState(1);
    });
    render(<Field />);
    act(() => {
      setFieldValue(2);
    });
    expect(
      screen.queryByText(new Date().toISOString()),
    ).not.toBeInTheDocument();
  });
});
