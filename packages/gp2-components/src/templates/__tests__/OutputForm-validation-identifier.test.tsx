import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';

import { StaticRouter } from 'react-router-dom/server';
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
    it('shows error message for missing value identifier type', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });

      const input = screen.getByLabelText(/identifier type/i, {
        selector: 'input',
      });

      fireEvent.focusOut(input);
      expect(screen.getByText('Please choose an identifier.')).toBeVisible();
    });
  });
});
