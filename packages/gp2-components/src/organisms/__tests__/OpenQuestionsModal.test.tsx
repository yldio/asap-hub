import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import OpenQuestionsModal from '../OpenQuestionsModal';

describe('OpenQuestionsModal', () => {
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

  it('renders the question field', () => {
    const props = { questions: ['a question?'] };
    renderOpenQuestions(props);
    expect(screen.getByRole('textbox')).toContainHTML(props.questions[0]);
  });

  it('renders multiple questions', () => {
    const props = {
      questions: [
        'a first question?',
        'a second question?',
        'a third question?',
      ],
    };
    renderOpenQuestions(props);
    screen
      .getAllByRole('textbox')
      .map((textarea, index) =>
        expect(textarea).toContainHTML(props.questions[index]),
      );
  });

  it('shows the add another question button', () => {
    renderOpenQuestions();
    expect(
      screen.getByRole('button', { name: /add another question/i }),
    ).toBeVisible();
  });

  it("doesn't show the add another question button if there's already five questions added", () => {
    const props = {
      questions: [
        'a first question?',
        'a second question?',
        'a third question?',
        'a fourth question?',
        'a fifth question?',
      ],
    };
    renderOpenQuestions(props);
    expect(
      screen.queryByRole('button', { name: /add another question/i }),
    ).not.toBeInTheDocument();
  });
});
