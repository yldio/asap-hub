import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';

import OpenQuestionsModal from '../OpenQuestionsModal';

const props: ComponentProps<typeof OpenQuestionsModal> = {
  ...createUserResponse(),
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<OpenQuestionsModal {...props} />);
  expect(getByText('Your Open Questions', { selector: 'h3' })).toBeVisible();
});

it('renders default values into text inputs', () => {
  const { getByLabelText } = render(
    <OpenQuestionsModal {...props} questions={['1', '2', '3', '4']} />,
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
      <MemoryRouter>
        <OpenQuestionsModal {...props} onSave={jestFn} />
      </MemoryRouter>,
    );

    const answerQuestion = (index: number) =>
      userEvent.type(
        getByLabelText(`Open Question ${index}`),
        questions[index],
        {
          allAtOnce: true,
        },
      );

    questions[1] && (await answerQuestion(1));
    questions[2] && (await answerQuestion(2));
    questions[3] && (await answerQuestion(3));
    questions[4] && (await answerQuestion(4));
    userEvent.click(getByText('Save'));
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
