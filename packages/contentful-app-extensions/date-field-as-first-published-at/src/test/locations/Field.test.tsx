import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen, waitFor } from '@testing-library/react';

import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

describe('Field component', () => {
  it('renders the value when its available', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        getValue: jest.fn(() => '2023-04-12T16:05:00.000Z'),
      },
    }));
    render(<Field />);

    expect(screen.getByText('2023-04-12T16:05:00.000Z')).toBeInTheDocument();
  });

  it('renders the value from the system firstPublishedAt when it is not available', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        getValue: jest.fn(),
      },
      entry: {
        getSys: () => ({ firstPublishedAt: '2020-10-11T16:05:00.000Z' }),
      },
    }));
    render(<Field />);
    expect(screen.getByText('2020-10-11T16:05:00.000Z')).toBeInTheDocument();
  });
});
