import '@testing-library/jest-dom';
import React from 'react';
import Field from '../../locations/Field';
import { render, screen } from '@testing-library/react';
import { useSDK } from '@contentful/react-apps-toolkit';

jest.mock('@contentful/react-apps-toolkit', () => ({
  useSDK: jest.fn(),
}));

describe('Field component', () => {
  it('displays text field', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        getValue: jest.fn(() => 'Hello World'),
      },
      window: {
        startAutoResizer: jest.fn(),
      },
    }));
    render(<Field />);

    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('displays json object', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        type: 'Object',
        getValue: jest.fn(() => ({ firstName: 'John', lastName: 'Doe' })),
      },
      window: {
        startAutoResizer: jest.fn(),
      },
    }));
    const { container } = render(<Field />);

    expect(container).toHaveTextContent(
      `{ "firstName": "John", "lastName": "Doe" }`,
    );
  });

  it('displays rich text', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        type: 'RichText',
        getValue: jest.fn(() => ({
          content: [
            {
              content: [
                {
                  data: {},
                  marks: [],
                  value: 'Hello world',
                  nodeType: 'text',
                },
              ],
              data: {},
              nodeType: 'paragraph',
            },
          ],
          data: {},
          nodeType: 'document',
        })),
      },
      window: {
        startAutoResizer: jest.fn(),
      },
    }));
    const { container } = render(<Field />);

    expect(container).toHaveTextContent('Hello world');
  });

  it('displays boolean', () => {
    (useSDK as jest.Mock).mockImplementation(() => ({
      field: {
        type: 'Boolean',
        getValue: jest.fn(() => false),
      },
      window: {
        startAutoResizer: jest.fn(),
      },
    }));
    render(<Field />);

    expect(screen.getByRole('radio', { name: 'Yes' })).not.toBeChecked();
    expect(screen.getByRole('radio', { name: 'Yes' })).toBeDisabled();
    expect(screen.getByRole('radio', { name: 'No' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'No' })).toBeDisabled();
  });
});
