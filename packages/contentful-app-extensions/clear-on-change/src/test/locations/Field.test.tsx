import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { fireEvent, render, screen } from '@testing-library/react';

import { useSDK, useFieldValue } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
  useFieldValue: jest.fn(),
}));

describe('Field component', () => {
  beforeEach(() => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      parameters: {
        instance: {
          observedField: 'orcid',
        },
      },
    }));
  });

  it('Displays the field value', () => {
    (useFieldValue as jest.Mock).mockImplementation((field) =>
      field === 'orcid'
        ? // always return the same ORCID
          ['0000-0003-0974-0307']
        : ['test-field-value', jest.fn()],
    );

    render(<Field />);

    expect(screen.getByText('test-field-value')).toBeInTheDocument();
  });

  it('Does not clear the field value when observed field remains the same', () => {
    const setCurrentFieldValueMock = jest.fn();
    (useFieldValue as jest.Mock).mockImplementation((field) =>
      field === 'orcid'
        ? // always return the same ORCID
          ['0000-0003-0974-0307']
        : ['2023-04-12T16:05:00.000Z', setCurrentFieldValueMock],
    );

    const { rerender } = render(<Field />);
    rerender(<Field />);

    expect(setCurrentFieldValueMock).not.toHaveBeenCalledWith(null);
  });

  it('Clears the field value when observed field changes', () => {
    const mockOrcid = jest
      .fn()
      .mockReturnValueOnce('0000-0000-0000-0000')
      .mockReturnValueOnce('0000-0003-0974-0307');
    const setCurrentFieldValueMock = jest.fn();
    (useFieldValue as jest.Mock).mockImplementation((field) =>
      field === 'orcid'
        ? // return a different ORCID on each call
          [mockOrcid()]
        : ['2023-04-12T16:05:00.000Z', setCurrentFieldValueMock],
    );

    const { rerender } = render(<Field />);
    rerender(<Field />);

    expect(setCurrentFieldValueMock).toHaveBeenCalledWith(null);
  });
});
