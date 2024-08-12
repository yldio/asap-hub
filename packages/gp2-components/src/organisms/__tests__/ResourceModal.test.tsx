import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { createMemoryRouter, MemoryRouter, Router, RouterProvider } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import ResourceModal from '../ResourceModal';

const defaultProps: ComponentProps<typeof ResourceModal> = {
  modalTitle: 'A title',
  modalDescription: 'A description',
  backHref: '/back',
};

const save = async () => {
  const saveButton = screen.getByRole('button', { name: /save/i });
  await userEvent.click(saveButton);
  return saveButton;
};

const deleteClick = async () => {
  const deleteButton = screen.getByRole('button', { name: /delete/i });
  await userEvent.click(deleteButton);
  return deleteButton;
};

const typeBox = () => screen.getByRole('combobox', { name: /type/i });
const enterType = async (type: string) => {
  await userEvent.type(typeBox(), `${type}{enter}`);
};
const titleBox = () => screen.getByRole('textbox', { name: /title/i });
const enterTitle = async (title: string) => await userEvent.type(titleBox(), title);
const descriptionBox = () =>
  screen.getByRole('textbox', { name: /description/i });
const enterDescription = async (description: string) =>
  await userEvent.type(descriptionBox(), description);

const linkBox = () => screen.getByRole('textbox', { name: /url/i });
const enterLink = async (link: string) => {
  await userEvent.clear(linkBox());
  await userEvent.type(linkBox(), link);
};

describe('ResourceModal', () => {
  beforeEach(jest.resetAllMocks);
  const renderResourseModal = (
    props: Partial<ComponentProps<typeof ResourceModal>> = {},
  ) => {
    const routes = [
      {
        path: '/',
        element: <ResourceModal {...defaultProps} {...props} />,
      },
      {
        path: '/back',
        element: 'Back',
      }
    ];
    const router = createMemoryRouter(routes);
    render(<RouterProvider router={router} />);
  };
  describe('dialog', () => {
    beforeEach(jest.resetAllMocks);
    const renderResourseModalWithDialog = (
      props: Partial<ComponentProps<typeof ResourceModal>> = {
        type: 'Note',
        title: 'a title',
        description: 'a description',
      },
    ) => {
      const getUserConfirmation = jest.fn((_message, cb) => cb(true));
      const history = createMemoryHistory();
      render(
        <Router navigator={history} location="/url">
          <ResourceModal {...defaultProps} {...props} />
        </Router>,
      );
      return {
        getUserConfirmation,
      };
    };
    it('shows the dialog when the user adds a new type', async () => {
      const { getUserConfirmation } = renderResourseModalWithDialog();
      await enterType('Link');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(getUserConfirmation).toHaveBeenCalledTimes(1);
    });

    it('the dialog shows when the user changes the resource information and cancels the action', async () => {
      const { getUserConfirmation } = renderResourseModalWithDialog();
      await enterType('Link');
      await enterLink('http://example.com');
      await enterTitle('A new title');
      await enterDescription('A new description');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(getUserConfirmation).toHaveBeenCalledTimes(1);
    });

    it(`the dialog doesn't show when the user doesn't add new changes`, async () => {
      const { getUserConfirmation } = renderResourseModalWithDialog();
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(getUserConfirmation).not.toHaveBeenCalled();
    });

    it('the dialog shows when the user changes type of resource', async () => {
      const { getUserConfirmation } = renderResourseModalWithDialog();
      await enterType('Link');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(getUserConfirmation).toHaveBeenCalledTimes(1);
    });
    it('the dialog shows when the user changes the link', async () => {
      const { getUserConfirmation } = renderResourseModalWithDialog({
        type: 'Link',
      });

      await enterLink('http://example2.com');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(getUserConfirmation).toHaveBeenCalledTimes(1);
    });
  });
  describe('edit modal', () => {
    it('renders the type of the resource', async () => {
      renderResourseModal({ type: 'Link', title: 'test' });
      await waitFor(() => expect(titleBox()).toBeEnabled());
      expect(await screen.findByText('Link')).toBeVisible();
    });
    it('renders the title of the resource', () => {
      renderResourseModal({ title: 'This is the new test' });
      expect(screen.getByRole('textbox', { name: /Title/i })).toHaveValue(
        'This is the new test',
      );
    });
    it('renders the description of the resource', () => {
      renderResourseModal({ description: 'This is the new description' });
      expect(screen.getByText('This is the new description')).toBeVisible();
    });
    it('renders the link of the resource', () => {
      renderResourseModal({
        type: 'Link',
        externalLink: 'https://www.google.com/',
      });
      expect(screen.getByRole('textbox', { name: /URL/i })).toHaveValue(
        'https://www.google.com/',
      );
    });
    it('renders the delete button if onDelete function is provided', () => {
      renderResourseModal({
        type: 'Link',
        externalLink: 'https://www.google.com/',
        onDelete: jest.fn(),
      });
      expect(screen.getByRole('button', { name: /delete/i })).toBeVisible();
    });
    it('allows a resource to be deleted', async () => {
      const onDelete = jest.fn();
      renderResourseModal({ onDelete });
      await enterType('Link');
      await enterTitle('a title');
      await enterLink('http://example.com');
      const deleteButton = await deleteClick();
      await waitFor(() => expect(deleteButton).toBeEnabled());
      expect(onDelete).toHaveBeenCalledWith();
    });
  });
  it('title and description should be disabled and url is hidden', () => {
    renderResourseModal();
    expect(descriptionBox()).toBeDisabled();
    expect(titleBox()).toBeDisabled();
    expect(
      screen.queryByRole('textbox', { name: /url/i }),
    ).not.toBeInTheDocument();
  });
  it('shows the title and the description', () => {
    renderResourseModal({
      modalTitle: 'This is the modal title',
      modalDescription: 'This is the modal description',
    });
    expect(
      screen.getByRole('heading', { name: /this is the modal title/i }),
    ).toBeVisible();
    expect(screen.getByText('This is the modal description')).toBeVisible();
  });
  it('a note should not display a Url', async () => {
    renderResourseModal();
    await enterType('Note');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(
      screen.queryByRole('textbox', { name: /url/i }),
    ).not.toBeInTheDocument();
  });
  it('a link should display a Url', async () => {
    renderResourseModal();
    await enterType('Link');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(await screen.findByRole('textbox', { name: /url/i })).toBeEnabled();
  });

  it('allows a note to be saved', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    await enterType('Note');
    await enterTitle('a title');
    const saveButton = await save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toHaveBeenCalledWith({
      type: 'Note',
      title: 'a title',
    });
  });
  it('allows a note with a description to be saved', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    await enterType('Note');
    await enterTitle('a title');
    await enterDescription('a description');
    const saveButton = await save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toHaveBeenCalledWith({
      type: 'Note',
      title: 'a title',
      description: 'a description',
    });
  });
  it('allows a link to be saved', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    await enterType('Link');
    await enterTitle('a title');
    await enterLink('http://example.com');
    const saveButton = await save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toHaveBeenCalledWith({
      type: 'Link',
      title: 'a title',
      externalLink: 'http://example.com',
    });
  });
  it('allows a link to be saved with a description', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    await enterType('Link');
    await enterTitle('a title');
    await enterLink('http://example.com');
    await enterDescription('a description');
    const saveButton = await save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toHaveBeenCalledWith({
      type: 'Link',
      title: 'a title',
      externalLink: 'http://example.com',
      description: 'a description',
    });
  });
  it('cancel button takes you back', () => {
    renderResourseModal();
    const cancelButton = screen.getByRole('link', { name: /Cancel/i });
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/back');
  });
  it('disables on save', async () => {
    renderResourseModal();
    await enterType('Note');
    await enterTitle('a title');
    await enterDescription('a description');
    const saveButton = await save();
    const form = saveButton.closest('form')!;
    expect(form.elements.length).toBeGreaterThan(1);
    [...form.elements].forEach((element) => expect(element).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeEnabled());
  });
  it('selecting a type is required', async () => {
    renderResourseModal();
    await save();
    expect(screen.getByText(/please enter a valid type/i)).toBeVisible();
  });

  it('a title and link is required', async () => {
    renderResourseModal();
    await enterType('Link');
    await save();
    expect(screen.getByText(/please enter a title/i)).toBeVisible();
    expect(screen.getByText(/please enter a valid link/i)).toBeVisible();
  });
});
