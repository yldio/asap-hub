import { fireEvent, render, screen } from '@testing-library/react';

import { StaticRouter } from 'react-router-dom';
import OutputForm from '../OutputForm';

describe('OutputForm', () => {
  const defaultProps = {
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
  };

  describe('validation', () => {
    it('shows error message for missing value URL', () => {
      render(<OutputForm {...defaultProps} documentType="Article" />, {
        wrapper: StaticRouter,
      });

      const input = screen.getByLabelText(/url/i);
      fireEvent.focusOut(input);
      expect(
        screen.getByText('Please enter a valid URL, starting with http://'),
      ).toBeVisible();
    });
  });
});
