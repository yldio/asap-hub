import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';

import OpenQuestionsModal from '../OpenQuestionsModal';

const props: ComponentProps<typeof OpenQuestionsModal> = {
  ...createUserResponse(),
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<OpenQuestionsModal {...props} />, {
    wrapper: StaticRouter,
  });
  expect(getByText('Your Open Questions', { selector: 'h3' })).toBeVisible();
});

it('renders which fields are mandatory/optional', () => {
  const { getByText } = render(<OpenQuestionsModal {...props} />, {
    wrapper: StaticRouter,
  });

  [
    { title: 'Open Question 1', subtitle: 'Required' },
    { title: 'Open Question 2', subtitle: 'Required' },
    { title: 'Open Question 3', subtitle: 'Optional' },
    { title: 'Open Question 4', subtitle: 'Optional' },
  ].forEach(({ title, subtitle }) =>
    expect(getByText(title).nextSibling?.textContent).toContain(subtitle),
  );
});

it('renders default values into text inputs', () => {
  const questions = ['1', '2', '3', '4'];

  const { container } = render(
    <OpenQuestionsModal {...props} questions={questions} />,
    { wrapper: StaticRouter },
  );

  container.querySelectorAll('textbox').forEach((elem, idx) => {
    expect(elem).toHaveValue(questions[idx]);
  });
});

describe('triggers the save function', () => {
  let jestFn: jest.Mock;
  const testSave = async (questions: { [id: string]: string }) => {
    jestFn = jest.fn();
    const { getByLabelText, getByText } = render(
      <OpenQuestionsModal {...props} onSave={jestFn} />,
      { wrapper: MemoryRouter },
    );

    const answerQuestion = (index: number) =>
      userEvent.type(
        getByLabelText(
          `Open Question ${index}${
            index === 1 || index === 2 ? '(Required)' : '(Optional)'
          }`,
        ),
        questions[index]!,
      );

    questions[1] && answerQuestion(1);
    questions[2] && answerQuestion(2);
    questions[3] && answerQuestion(3);
    questions[4] && answerQuestion(4);
    userEvent.click(getByText('Save'));

    await waitFor(() =>
      expect(getByText(/save/i).closest('button')).toBeEnabled(),
    );
  };

  it('does not save if no questions are set', async () => {
    await testSave({});
    expect(jestFn).not.toHaveBeenCalled();
  });

  it('does not save if required questions 1 and 2 are empty', async () => {
    await testSave({ 3: 'c', 4: 'd' });
    expect(jestFn).not.toHaveBeenCalled();
  });

  it('sends questions when a non required question is skipped', async () => {
    await testSave({ 1: 'a', 2: 'b', 4: 'd' });
    expect(jestFn).toHaveBeenCalledWith({ questions: ['a', 'b', 'd'] });
  });

  it('sends all questions', async () => {
    await testSave({ 1: 'a', 2: 'b', 3: 'c', 4: 'd' });
    expect(jestFn).toHaveBeenCalledWith({ questions: ['a', 'b', 'c', 'd'] });
  });
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <OpenQuestionsModal
      {...props}
      onSave={handleSave}
      questions={['a', 'b']}
    />,
    { wrapper: StaticRouter },
  );

  userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
