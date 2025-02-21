import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import OpenQuestionsModal from '../OpenQuestionsModal';

describe('OpenQuestionsModal', () => {
  type OpenQuestionsModalProps = ComponentProps<typeof OpenQuestionsModal>;
  const defaultProps: OpenQuestionsModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderOpenQuestions = (
    overrides: Partial<OpenQuestionsModalProps> = {},
  ) =>
    render(
      <MemoryRouter>
        <OpenQuestionsModal {...defaultProps} {...overrides} />
      </MemoryRouter>,
    );

  beforeEach(jest.resetAllMocks);

  it('renders a dialog with the right title', () => {
    renderOpenQuestions();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Open Questions' }),
    );
  });

  it('renders the question field', () => {
    const props = { questions: ['a question?'] };
    renderOpenQuestions(props);
    expect(screen.getByRole('textbox')).toHaveTextContent(props.questions[0]!);
  });

  it('renders multiple questions', () => {
    const props = {
      questions: [
        'a first question?',
        'a second question?',
        'a third question?',
      ],
    };
    renderOpenQuestions();
    screen
      .getAllByRole('textbox')
      .map((textarea, index) =>
        expect(textarea).toHaveTextContent(props.questions[index]!),
      );
  });

  it('shows the add another question button', () => {
    const props = {
      questions: [
        'a first question?',
        'a second question?',
        'a third question?',
      ],
    };
    renderOpenQuestions(props);
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
  it('adds a question', () => {
    const props = {
      questions: [
        'a first question?',
        'a second question?',
        'a third question?',
      ],
    };
    const newQuestion = 'a fourth question?';
    renderOpenQuestions(props);
    const addButton = screen.getByRole('button', {
      name: 'Add Another Question Add',
    });
    userEvent.click(addButton);
    const emptyTextArea = screen.getAllByRole('textbox')[3]!;
    userEvent.type(emptyTextArea, newQuestion);
    expect(emptyTextArea).toHaveTextContent(newQuestion);
  });
  it('removes the only question it exists and shows the add open question button', () => {
    const onSave = jest.fn();
    const props = {
      questions: ['a first question?'],
      onSave,
    };
    renderOpenQuestions(props);

    const deleteButton = screen.getByRole('button', { name: /delete/i });
    userEvent.click(deleteButton);
    expect(
      screen.getByRole('button', { name: /add open question add/i }),
    ).toBeVisible();
  });
  it("closes the dialog if the user doesn't have any questions and he doesn't want to create a new questions", async () => {
    const props = {
      questions: [],
    };
    renderOpenQuestions(props);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await waitFor(() => userEvent.click(closeButton));

    expect(closeButton).toBeDisabled();
  });

  it('allows the saveButton to saves all the information', async () => {
    const onSave = jest.fn();
    const props = {
      questions: [
        'a first question?',
        'a second question?',
        'a third question?',
      ],
      onSave,
    };
    renderOpenQuestions(props);

    const newQuestion = 'a fourth question?';
    const addButton = screen.getByRole('button', {
      name: 'Add Another Question Add',
    });
    userEvent.click(addButton);
    const emptyTextArea = screen.getAllByRole('textbox')[3]!;
    userEvent.type(emptyTextArea, newQuestion);
    expect(emptyTextArea).toHaveTextContent(newQuestion);
    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => userEvent.click(saveButton));
    expect(onSave).toHaveBeenCalledWith({
      questions: [
        'a first question?',
        'a second question?',
        'a third question?',
        'a fourth question?',
      ],
    });
  });

  it('when saving an empty question it will remove it from the questions list', async () => {
    const onSave = jest.fn();
    const props = {
      questions: ['Am I a question?', ''],
      onSave,
    };
    renderOpenQuestions(props);

    const saveButton = screen.getByRole('button', { name: 'Save' });
    await waitFor(() => userEvent.click(saveButton));
    expect(onSave).toHaveBeenCalledWith({ questions: ['Am I a question?'] });
  });
});
