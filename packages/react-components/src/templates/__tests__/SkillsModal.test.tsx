import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import SkillsModal from '../SkillsModal';
import { ember } from '../../colors';

const props: ComponentProps<typeof SkillsModal> = {
  ...createUserResponse(),
  skillSuggestions: [],
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<SkillsModal {...props} />, {
    wrapper: StaticRouter,
  });
  expect(
    getByText('Expertise and resources', { selector: 'h3' }),
  ).toBeVisible();
});

it('renders default values into text inputs', () => {
  const { getByLabelText } = render(
    <SkillsModal {...props} skillsDescription="example description" />,
    { wrapper: StaticRouter },
  );
  expect(getByLabelText(/overview/i)).toHaveValue('example description');
});

it('triggers the save function', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = render(
    <SkillsModal
      {...props}
      skills={['1', '2', '3', '4']}
      skillSuggestions={['1', '2', '3', '4', '5']}
      onSave={handleSave}
    />,
    { wrapper: MemoryRouter },
  );

  userEvent.type(getByLabelText(/overview/i), 'example description');

  userEvent.type(getByLabelText(/skills/i), '5');
  userEvent.tab();

  userEvent.click(getByText('Save'));

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
  expect(handleSave).toHaveBeenCalledWith({
    skillsDescription: 'example description',
    skills: ['1', '2', '3', '4', '5'],
  });
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <SkillsModal
      {...props}
      skills={['1', '2', '3', '4', '5']}
      onSave={handleSave}
    />,
    {
      wrapper: StaticRouter,
    },
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

describe('skills selection', () => {
  it('displays a no options message', async () => {
    const { getByLabelText, getByText } = render(
      <SkillsModal {...props} skillSuggestions={['abc']} />,
      { wrapper: StaticRouter },
    );

    userEvent.type(getByLabelText(/skills/i), 'def');
    expect(getByText('Sorry, No current tags match "def"')).toBeVisible();
  });

  it('displays an error message when not enough skills have been selected on save', () => {
    const handleSave = jest.fn();
    const { getByText, getByLabelText } = render(
      <SkillsModal
        {...props}
        skills={['1', '2', '3', '4']}
        onSave={handleSave}
      />,
      {
        wrapper: StaticRouter,
      },
    );
    const input = getByLabelText(/skills/i);
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).not.toEqual(
      ember.rgb,
    );
    userEvent.click(getByText(/save/i));
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toEqual(
      ember.rgb,
    );
    expect(handleSave).not.toHaveBeenCalled();
  });

  it('removes error message when enough skills are selected', () => {
    const handleSave = jest.fn();
    const { getByText, queryByText, getByLabelText } = render(
      <SkillsModal
        {...props}
        skills={['1', '2', '3', '4']}
        skillSuggestions={['1', '2', '3', '4', '5']}
        onSave={handleSave}
      />,
      {
        wrapper: StaticRouter,
      },
    );
    userEvent.click(getByText(/save/i));
    const input = getByLabelText(/skills/i);
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toEqual(
      ember.rgb,
    );
    expect(getByText('Please add a minimum of 5 tags')).toBeVisible();

    userEvent.type(input, '5');
    userEvent.tab();
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).not.toEqual(
      ember.rgb,
    );
    expect(
      queryByText('Please add a minimum of 5 tags'),
    ).not.toBeInTheDocument();
  });
});
