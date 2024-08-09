import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';

import OutputForm from '../OutputForm';

describe('OutputForm', () => {
  const defaultProps: ComponentProps<typeof OutputForm> = {
    shareOutput: jest.fn(),
    documentType: 'Procedural Form' as const,
    entityType: 'workingGroup' as const,
    tagSuggestions: [],
    cohortSuggestions: [],
    workingGroupSuggestions: [],
    projectSuggestions: [],
    mainEntityId: '12',
    getRelatedOutputSuggestions: jest.fn(),
    getRelatedEventSuggestions: jest.fn(),
    getShortDescriptionFromDescription: jest.fn(),
  };

  describe('validation', () => {
    it('shows error message for missing value type', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: MemoryRouter,
      });

      const input = screen.getByLabelText(/^type/i);
      fireEvent.focusOut(input);
      expect(screen.getByText('Please fill out this field.')).toBeVisible();
    });
  });
});
