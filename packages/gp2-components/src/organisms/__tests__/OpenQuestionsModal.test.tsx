import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
//import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import OpenQuestionsModal from '../OpenQuestionsModal';

describe('OpenQuestionsModal', () => {
  //const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type OpenQuestionsModalProps = ComponentProps<typeof OpenQuestionsModal>;
  const defaultProps: OpenQuestionsModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderOpenQuestions = (
    overrides: Partial<OpenQuestionsModalProps> = {},
  ) =>
    render(<OpenQuestionsModal {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderOpenQuestions();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Open Questions' }),
    );
  });
});
