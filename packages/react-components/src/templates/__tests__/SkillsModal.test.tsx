import { ComponentProps } from 'react';
import { render, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, StaticRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';

import SkillsModal from '../SkillsModal';

const props: ComponentProps<typeof SkillsModal> = {
  ...createUserResponse(),
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
    <SkillsModal {...props} onSave={handleSave} />,
    { wrapper: MemoryRouter },
  );

  userEvent.type(getByLabelText(/overview/i), 'example description');
  userEvent.click(getByText('Save'));

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
  expect(handleSave).toHaveBeenCalledWith({
    skillsDescription: 'example description',
  });
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(<SkillsModal {...props} onSave={handleSave} />, {
    wrapper: StaticRouter,
  });

  userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});
