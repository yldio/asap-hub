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

it('renders default values into text inputs', () => {
  const { getByLabelText } = render(
    <OpenQuestionsModal {...props} questions={['1', '2', '3', '4']} />,
    { wrapper: StaticRouter },
  );
  expect(getByLabelText(/open question 1/i)).toHaveValue('1');
  expect(getByLabelText(/open question 2/i)).toHaveValue('2');
  expect(getByLabelText(/open question 3/i)).toHaveValue('3');
  expect(getByLabelText(/open question 4/i)).toHaveValue('4');
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
        getByLabelText(`Open Question ${index}`),
        questions[index],
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

  it('sends an empty array when no questions are entered and saved', async () => {
    await testSave({});
    expect(jestFn).toHaveBeenCalledWith({ questions: [] });
  });
  it('sends questions when a question is skipped', async () => {
    await testSave({ 1: 'a', 4: 'b' });
    expect(jestFn).toHaveBeenCalledWith({ questions: ['a', 'b'] });
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
    <OpenQuestionsModal {...props} onSave={handleSave} />,
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
