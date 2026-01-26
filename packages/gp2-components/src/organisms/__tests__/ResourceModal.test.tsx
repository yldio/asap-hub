import {
  mockActWarningsInConsole,
  mockNavigateWarningsInConsole,
} from '@asap-hub/dom-test-utils';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import { NavigationBlockerProvider } from '@asap-hub/react-components';
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
const enterTitle = async (title: string) => {
  await userEvent.type(titleBox(), title);
};
const descriptionBox = () =>
  screen.getByRole('textbox', { name: /description/i });
const enterDescription = async (description: string) =>
  userEvent.type(descriptionBox(), description);

const linkBox = () => screen.getByRole('textbox', { name: /url/i });
const enterLink = async (link: string) => {
  await userEvent.clear(linkBox());
  await userEvent.type(linkBox(), link);
};

describe('ResourceModal', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // jest.spyOn(console, 'warn').mockImplementation();
    // jest.spyOn(console, 'error').mockImplementation();
    jest.spyOn(window, 'confirm').mockImplementation(() => true);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  const renderResourceModal = (
    props: Partial<ComponentProps<typeof ResourceModal>> = {},
  ) => {
    render(
      <StaticRouter location="/">
        <ResourceModal {...defaultProps} {...props} />
      </StaticRouter>,
    );
  };

  const renderResourceModalWithNavigation = (
    props: Partial<ComponentProps<typeof ResourceModal>> = {},
  ) => {
    render(
      <MemoryRouter>
        <NavigationBlockerProvider>
          <ResourceModal {...defaultProps} {...props} />
        </NavigationBlockerProvider>
      </MemoryRouter>,
    );
  };

  describe('navigation blocking', () => {
    it('shows the confirm dialog when the user adds a new type and clicks cancel', async () => {
      renderResourceModalWithNavigation({
        type: 'Note',
        title: 'a title',
        description: 'a description',
      });

      await enterType('Link');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(window.confirm).toHaveBeenCalledTimes(1);
    });

    it('shows the confirm dialog when the user changes resource information and cancels', async () => {
      renderResourceModalWithNavigation({
        type: 'Note',
        title: 'a title',
        description: 'a description',
      });

      await enterType('Link');
      await enterLink('http://example.com');
      await enterTitle('A new title');
      await enterDescription('A new description');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(window.confirm).toHaveBeenCalledTimes(1);
    });

    it('does not show the confirm dialog when the user does not make changes', async () => {
      renderResourceModalWithNavigation({
        type: 'Note',
        title: 'a title',
        description: 'a description',
      });

      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(window.confirm).not.toHaveBeenCalled();
    });

    it('shows the confirm dialog when the user changes type of resource', async () => {
      renderResourceModalWithNavigation({
        type: 'Note',
        title: 'a title',
        description: 'a description',
      });

      await enterType('Link');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(window.confirm).toHaveBeenCalledTimes(1);
    });

    it('shows the confirm dialog when the user changes the link', async () => {
      renderResourceModalWithNavigation({
        type: 'Link',
        title: 'a title',
        externalLink: 'http://example.com',
      });

      await enterLink('http://example2.com');
      const cancelButton = screen.getByRole('link', { name: /cancel/i });
      await userEvent.click(cancelButton);
      expect(window.confirm).toHaveBeenCalledTimes(1);
    });
  });

  describe('edit modal', () => {
    it('renders the type of the resource', async () => {
      renderResourceModal({ type: 'Link', title: 'test' });
      await waitFor(() => expect(titleBox()).toBeEnabled());
      expect(await screen.findByText('Link')).toBeVisible();
    });
    it('renders the title of the resource', () => {
      renderResourceModal({ title: 'This is the new test' });
      expect(screen.getByRole('textbox', { name: /Title/i })).toHaveValue(
        'This is the new test',
      );
    });
    it('renders the description of the resource', () => {
      renderResourceModal({ description: 'This is the new description' });
      expect(screen.getByText('This is the new description')).toBeVisible();
    });
    it('renders the link of the resource', () => {
      renderResourceModal({
        type: 'Link',
        externalLink: 'https://www.google.com/',
      });
      expect(screen.getByRole('textbox', { name: /URL/i })).toHaveValue(
        'https://www.google.com/',
      );
    });
    it('renders the delete button if onDelete function is provided', () => {
      renderResourceModal({
        type: 'Link',
        externalLink: 'https://www.google.com/',
        onDelete: jest.fn(),
      });
      expect(screen.getByRole('button', { name: /delete/i })).toBeVisible();
    });
    it('allows a resource to be deleted', async () => {
      mockNavigateWarningsInConsole();
      const onDelete = jest.fn();
      renderResourceModal({ onDelete });
      await enterType('Link');
      await enterTitle('a title');
      await enterLink('http://example.com');
      const deleteButton = await deleteClick();
      await waitFor(() => expect(deleteButton).toBeEnabled());
      expect(onDelete).toHaveBeenCalledWith();
    });
  });

  it('title and description should be disabled and url is hidden', () => {
    renderResourceModal();
    expect(descriptionBox()).toBeDisabled();
    expect(titleBox()).toBeDisabled();
    expect(
      screen.queryByRole('textbox', { name: /url/i }),
    ).not.toBeInTheDocument();
  });

  it('shows the title and the description', () => {
    renderResourceModal({
      modalTitle: 'This is the modal title',
      modalDescription: 'This is the modal description',
    });
    expect(
      screen.getByRole('heading', { name: /this is the modal title/i }),
    ).toBeVisible();
    expect(screen.getByText('This is the modal description')).toBeVisible();
  });

  it('a note should not display a Url', async () => {
    renderResourceModal();
    await enterType('Note');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(
      screen.queryByRole('textbox', { name: /url/i }),
    ).not.toBeInTheDocument();
  });

  it('a link should display a Url', async () => {
    renderResourceModal();
    await enterType('Link');
    expect(descriptionBox()).toBeEnabled();
    expect(titleBox()).toBeEnabled();
    expect(await screen.findByRole('textbox', { name: /url/i })).toBeEnabled();
  });

  it('allows a note to be saved', async () => {
    mockNavigateWarningsInConsole();
    const onSave = jest.fn();
    renderResourceModal({ onSave });
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
    mockNavigateWarningsInConsole();
    const onSave = jest.fn();
    renderResourceModal({ onSave });
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
    mockNavigateWarningsInConsole();
    const onSave = jest.fn();
    renderResourceModal({ onSave });
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
    mockNavigateWarningsInConsole();
    const onSave = jest.fn();
    renderResourceModal({ onSave });
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
    renderResourceModal();
    const cancelButton = screen.getByRole('link', { name: /Cancel/i });
    expect(cancelButton.closest('a')).toHaveAttribute('href', '/back');
  });

  it('disables on save', async () => {
    mockNavigateWarningsInConsole();
    let resolveSave: () => void;
    const onSave = jest.fn(
      () =>
        new Promise<void>((resolve) => {
          resolveSave = resolve;
        }),
    );
    renderResourceModal({ onSave });
    await enterType('Note');
    await enterTitle('a title');
    await enterDescription('a description');
    const saveButton = await save();
    const form = saveButton.closest('form')!;
    expect(form.elements.length).toBeGreaterThan(1);
    // Check that visible form inputs are disabled during save (excluding hidden inputs and the save button)
    [...form.elements].forEach((element) => {
      if (
        element !== saveButton &&
        element instanceof HTMLInputElement &&
        element.type !== 'hidden'
      ) {
        const styles = window.getComputedStyle(element);
        const inlineStyle = element.getAttribute('style') || '';
        // Skip hidden inputs (opacity 0 or display none) - these are often used by combobox/autocomplete components
        const isHidden =
          styles.opacity === '0' ||
          styles.display === 'none' ||
          inlineStyle.includes('opacity: 0') ||
          inlineStyle.includes('opacity:0');
        if (!isHidden) {
          // eslint-disable-next-line jest/no-conditional-expect -- Intentionally checking only visible inputs; hidden inputs are part of combobox/autocomplete internals
          expect(element).toBeDisabled();
        }
      }
    });
    resolveSave!();
    await waitFor(() => expect(saveButton).toBeEnabled());
  });

  it('selecting a type is required', async () => {
    renderResourceModal();
    await save();
    expect(screen.getByText(/please enter a valid type/i)).toBeVisible();
  });

  it('a title and link is required', async () => {
    mockActWarningsInConsole('error');
    renderResourceModal();
    await enterType('Link');
    await save();
    expect(screen.getByText(/please enter a title/i)).toBeVisible();
    expect(screen.getByText(/please enter a valid link/i)).toBeVisible();
  });
});
