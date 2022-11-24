import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { Router, StaticRouter } from 'react-router-dom';
import { History, createMemoryHistory } from 'history';
import ResourceModal from '../ResourceModal';

const defaultProps: ComponentProps<typeof ResourceModal> = {
  modalTitle: 'A title',
  modalDescription: 'A description',
  backHref: '/back',
};

const save = () => {
  const saveButton = screen.getByRole('button', { name: /save/i });
  userEvent.click(saveButton);
  return saveButton;
};

const typeBox = () => screen.getByRole('textbox', { name: /type/i });
const enterType = (type: string) => {
  userEvent.type(typeBox(), `${type}{enter}`);
};
const titleBox = () => screen.getByRole('textbox', { name: /title/i });
const enterTitle = (title: string) => userEvent.type(titleBox(), title);
const descriptionBox = () =>
  screen.getByRole('textbox', { name: /description/i });
const enterDescription = (description: string) =>
  userEvent.type(descriptionBox(), description);

const linkBox = () => screen.getByRole('textbox', { name: /url/i });
const enterLink = (link: string) => {
  userEvent.clear(linkBox());
  userEvent.type(linkBox(), link);
};

let getUserConfirmation!: jest.MockedFunction<
  (message: string, callback: (confirmed: boolean) => void) => void
>;
let history!: History;

beforeEach(jest.resetAllMocks);

describe('ResourceModal', () => {
  const renderResourseModal = (
    props: Partial<ComponentProps<typeof ResourceModal>> = {},
  ) => {
    render(<ResourceModal {...defaultProps} {...props} />, {
      wrapper: StaticRouter,
    });
  };
  test('title and description should be disabled and url is hidden', () => {
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
  it('a note should not display a Url', () => {
    renderResourseModal();
    enterType('Note');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(
      screen.queryByRole('textbox', { name: /url/i }),
    ).not.toBeInTheDocument();
  });
  it('a link should display a Url', async () => {
    renderResourseModal();
    enterType('Link');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(await screen.findByRole('textbox', { name: /url/i })).toBeEnabled();
  });

  it('allows a note to be saved', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    enterType('Note');
    enterTitle('a title');
    const saveButton = save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toBeCalledWith({
      type: 'Note',
      title: 'a title',
    });
  });
  it('allows a note with a description to be saved', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    enterType('Note');
    enterTitle('a title');
    enterDescription('a description');
    const saveButton = save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toBeCalledWith({
      type: 'Note',
      title: 'a title',
      description: 'a description',
    });
  });
  it('allows a link to be saved', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    enterType('Link');
    enterTitle('a title');
    enterLink('http://example.com');
    const saveButton = save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toBeCalledWith({
      type: 'Link',
      title: 'a title',
      externalLink: 'http://example.com',
    });
  });
  it('allows a link to be saved with a description', async () => {
    const onSave = jest.fn();
    renderResourseModal({ onSave });
    enterType('Link');
    enterTitle('a title');
    enterLink('http://example.com');
    enterDescription('a description');
    const saveButton = save();
    await waitFor(() => expect(saveButton).toBeEnabled());
    expect(onSave).toBeCalledWith({
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
    enterType('Note');
    enterTitle('a title');
    enterDescription('a description');
    const saveButton = save();
    const form = saveButton.closest('form')!;
    expect(form.elements.length).toBeGreaterThan(1);
    [...form.elements].forEach((element) => expect(element).toBeDisabled());
    await waitFor(() => expect(saveButton).toBeEnabled());
  });
  it('selecting a type is required', () => {
    renderResourseModal();
    save();
    expect(screen.getByText(/please enter a valid type/i)).toBeVisible();
  });

  it('a title and link is required', () => {
    renderResourseModal();
    enterType('Link');
    save();
    expect(screen.getByText(/please enter a title/i)).toBeVisible();
    expect(screen.getByText(/please enter a valid link/i)).toBeVisible();
  });

  it('shows the dialog when the user adds a new type', () => {
    getUserConfirmation = jest.fn((_message, cb) => cb(true));
    history = createMemoryHistory({ getUserConfirmation });

    render(
      <Router history={history}>
        <ResourceModal {...defaultProps} />
      </Router>,
    );
    enterType('Link');
    const cancelButton = screen.getByRole('link', { name: /cancel/i });
    userEvent.click(cancelButton);
    expect(getUserConfirmation).toHaveBeenCalledTimes(1);
  });

  it('the dialog shows when the user changes the resource information and cancels the action', () => {
    getUserConfirmation = jest.fn((_message, cb) => cb(true));
    history = createMemoryHistory({ getUserConfirmation });

    const props = {
      type: 'Note' as const,
      title: 'A title',
      description: 'A description',
    };

    render(
      <Router history={history}>
        <ResourceModal {...defaultProps} {...props} />
      </Router>,
    );
    enterType('Link');
    enterLink('http://example.com');
    enterTitle('A new title');
    enterDescription('A new description');
    const cancelButton = screen.getByRole('link', { name: /cancel/i });
    userEvent.click(cancelButton);
    expect(getUserConfirmation).toHaveBeenCalledTimes(1);
  });

  it("the dialog doesn't show when the user doesn't add new changes", () => {
    getUserConfirmation = jest.fn((_message, cb) => cb(true));
    history = createMemoryHistory({ getUserConfirmation });

    const props = {
      type: 'Note' as const,
      title: 'A title',
      description: 'A description',
    };

    render(
      <Router history={history}>
        <ResourceModal {...defaultProps} {...props} />
      </Router>,
    );
    const cancelButton = screen.getByRole('link', { name: /cancel/i });
    userEvent.click(cancelButton);
    expect(getUserConfirmation).not.toHaveBeenCalled();
  });
  it('the dialog shows when the user changes type of resource', () => {
    getUserConfirmation = jest.fn((_message, cb) => cb(true));
    history = createMemoryHistory({ getUserConfirmation });

    const props = {
      type: 'Note' as const,
      title: 'A title',
      description: 'A description',
    };

    render(
      <Router history={history}>
        <ResourceModal {...defaultProps} {...props} />
      </Router>,
    );
    enterType('Link');
    const cancelButton = screen.getByRole('link', { name: /cancel/i });
    userEvent.click(cancelButton);
    expect(getUserConfirmation).toHaveBeenCalledTimes(1);
  });
  it('the dialog shows when the user changes the link', () => {
    getUserConfirmation = jest.fn((_message, cb) => cb(true));
    history = createMemoryHistory({ getUserConfirmation });

    const props = {
      type: 'Link' as const,
      externalLink: 'http://example.com',
      title: 'A title',
      description: 'A description',
    };

    render(
      <Router history={history}>
        <ResourceModal {...defaultProps} {...props} />
      </Router>,
    );
    enterLink('http://example2.com');
    const cancelButton = screen.getByRole('link', { name: /cancel/i });
    userEvent.click(cancelButton);
    expect(getUserConfirmation).toHaveBeenCalledTimes(1);
  });
});
