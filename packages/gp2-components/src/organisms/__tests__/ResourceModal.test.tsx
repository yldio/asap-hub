import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';
import ResourceModal from '../ResourceModal';

const onSave = jest.fn();
const defaultProps = {
  backHref: '/back',
  onSave,
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
const enterLink = (link: string) => userEvent.type(linkBox(), link);
beforeEach(jest.resetAllMocks);

describe('ResourceModal', () => {
  beforeEach(() => {
    render(<ResourceModal {...defaultProps} />, { wrapper: StaticRouter });
  });
  test('title and description should be disabled and url is hidden', () => {
    expect(descriptionBox()).toBeDisabled();
    expect(titleBox()).toBeDisabled();
    expect(
      screen.queryByRole('textbox', { name: /url/i }),
    ).not.toBeInTheDocument();
  });
  it('a note should not display a Url', () => {
    enterType('Note');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(
      screen.queryByRole('textbox', { name: /url/i }),
    ).not.toBeInTheDocument();
  });
  it('a link should display a Url', async () => {
    enterType('Link');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(await screen.findByRole('textbox', { name: /url/i })).toBeEnabled();
  });

  it('allows a note to be saved', async () => {
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
    const cancelButton = screen.getByRole('link', { name: /Cancel/i });
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/back');
  });
  it('disables on save', async () => {
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
    save();
    expect(screen.getByText(/please enter a valid type/i)).toBeVisible();
  });

  it('a title and link is required', () => {
    enterType('Link');
    save();
    expect(screen.getByText(/please enter a title/i)).toBeVisible();
    expect(screen.getByText(/please enter a valid link/i)).toBeVisible();
  });
});
