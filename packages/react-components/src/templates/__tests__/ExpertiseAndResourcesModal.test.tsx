import { ComponentProps } from 'react';
import { render, act, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { createUserResponse } from '@asap-hub/fixtures';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import ExpertiseAndResourcesModal from '../ExpertiseAndResourcesModal';
import { ember, steel } from '../../colors';

const mapTags = (tags: string[]) => tags.map((tag) => ({ name: tag, id: tag }));

const props: ComponentProps<typeof ExpertiseAndResourcesModal> = {
  ...createUserResponse(),
  suggestions: [],
  backHref: '/wrong',
};
it('renders the title', () => {
  const { getByText } = render(<ExpertiseAndResourcesModal {...props} />, {
    wrapper: MemoryRouter,
  });
  expect(
    getByText('Expertise, Resources and Tags', { selector: 'h3' }),
  ).toBeVisible();
});

it('indicates which fields are required or optional', () => {
  const { getByText } = render(<ExpertiseAndResourcesModal {...props} />, {
    wrapper: MemoryRouter,
  });

  [
    { title: 'Tags', subtitle: 'required' },
    { title: 'Expertise and Resources', subtitle: 'optional' },
  ].forEach(({ title, subtitle }) =>
    expect(getByText(title).nextSibling?.textContent).toContain(subtitle),
  );
});

it('renders default values into text inputs', () => {
  const { getByLabelText } = render(
    <ExpertiseAndResourcesModal
      {...props}
      expertiseAndResourceDescription="example description"
    />,
    { wrapper: MemoryRouter },
  );
  expect(getByLabelText(/expertise and resources/i)).toHaveValue(
    'example description',
  );
});

it('triggers the save function', async () => {
  const handleSave = jest.fn();
  const { getByLabelText, getByText } = render(
    <ExpertiseAndResourcesModal
      {...props}
      tags={mapTags(['1', '2', '3', '4'])}
      suggestions={mapTags(['1', '2', '3', '4', '5'])}
      onSave={handleSave}
    />,
    { wrapper: MemoryRouter },
  );

  userEvent.type(
    getByLabelText(/expertise and resources/i),
    'example description',
  );

  userEvent.type(getByLabelText(/tags/i), '5');
  userEvent.tab();

  userEvent.click(getByText('Save'));

  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
  expect(handleSave).toHaveBeenCalledWith({
    expertiseAndResourceDescription: 'example description',
    tagIds: ['1', '2', '3', '4', '5'],
  });
});

it('disables the form elements while submitting', async () => {
  let resolveSubmit!: () => void;
  const handleSave = () =>
    new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
  const { getByText } = render(
    <ExpertiseAndResourcesModal
      {...props}
      tags={mapTags(['1', '2', '3', '4', '5'])}
      onSave={handleSave}
    />,
    {
      wrapper: MemoryRouter,
    },
  );

  await userEvent.click(getByText(/save/i));

  const form = getByText(/save/i).closest('form')!;
  expect(form.elements.length).toBeGreaterThan(1);
  [...form.elements].forEach((element) => expect(element).toBeDisabled());

  act(resolveSubmit);
  await waitFor(() =>
    expect(getByText(/save/i).closest('button')).toBeEnabled(),
  );
});

describe('tags selection', () => {
  it('displays a no options message', async () => {
    const { getByLabelText, getByText } = render(
      <ExpertiseAndResourcesModal {...props} suggestions={mapTags(['abc'])} />,
      { wrapper: MemoryRouter },
    );

    await userEvent.type(getByLabelText(/tags/i), 'def');
    expect(getByText('Sorry, No current tags match "def"')).toBeVisible();
  });

  it('displays an error message when not enough tags have been selected on save', async () => {
    const handleSave = jest.fn();
    const { getByText, getByLabelText } = render(
      <ExpertiseAndResourcesModal
        {...props}
        tags={mapTags(['1', '2', '3', '4'])}
        onSave={handleSave}
      />,
      {
        wrapper: MemoryRouter,
      },
    );
    const input = getByLabelText(/tags/i);
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).not.toEqual(
      ember.rgb,
    );
    await userEvent.click(getByText(/save/i));
    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toEqual(
      steel.rgb,
    );
    expect(handleSave).not.toHaveBeenCalled();
  });

  it('removes error message when enough tags are selected', async () => {
    const handleSave = jest.fn();
    const { getByLabelText, getByText, queryByText } = render(
      <ExpertiseAndResourcesModal
        {...props}
        tags={mapTags(['1', '2', '3'])}
        suggestions={mapTags(['1', '2', '3', '4', '5'])}
        onSave={handleSave}
      />,
      {
        wrapper: MemoryRouter,
      },
    );

    const input = getByLabelText(/tags/i);
    await userEvent.click(input);
    await userEvent.type(input, '4');
    await userEvent.type(input, `{enter}`);
    fireEvent.blur(input);

    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toEqual(
      ember.rgb,
    );
    expect(getByText('Please add a minimum of 5 tags')).toBeVisible();

    await userEvent.click(input);
    await userEvent.type(input, '5');
    await userEvent.type(input, `{enter}`);
    fireEvent.blur(input);

    expect(findParentWithStyle(input, 'borderColor')?.borderColor).toEqual(
      steel.rgb,
    );
    expect(
      queryByText('Please add a minimum of 5 tags'),
    ).not.toBeInTheDocument();
  });
});
