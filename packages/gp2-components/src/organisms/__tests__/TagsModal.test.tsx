import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom/server';
import TagsModal from '../TagsModal';

describe('TagsModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type TagsModalProps = ComponentProps<typeof TagsModal>;
  const defaultProps: TagsModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
    suggestions: [{ name: 'Tag-2', id: 'id-2' }],
  };

  const renderModal = (overrides: Partial<TagsModalProps> = {}) =>
    render(
      <StaticRouter location="/url">
        <TagsModal {...defaultProps} {...overrides} />
      </StaticRouter>,
    );

  it('renders a dialog with the right title', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Tags' }),
    );
  });

  it.each`
    tags                                  | expected
    ${undefined}                          | ${'Start typing...'}
    ${[{ id: 'id-1', name: 'Genetics' }]} | ${'Genetics'}
  `('renders tags with value "$expected"', ({ tags, expected }) => {
    renderModal({ tags });
    const textbox = screen.getByRole('textbox', {
      name: /Tags/i,
    });
    expect(textbox).toBeVisible();
    expect(screen.getByText(expected)).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const tags = [{ id: 'id-1', name: 'Genetics' }] as gp2Model.TagDataObject[];
    renderModal({
      tags,
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      tags: tags.map((t) => ({
        id: t.id,
      })),
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    renderModal({
      tags: [],
      onSave,
    });

    userEvent.click(
      screen.getByRole('textbox', {
        name: /Tags/i,
      }),
    );
    userEvent.click(screen.getByText('Tag-2'));

    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      tags: [{ id: 'id-2' }],
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('shows validation message', async () => {
    const onSave = jest.fn();
    renderModal({
      tags: [],
      onSave,
    });

    userEvent.click(getSaveButton());
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Please add your tags')).toBeVisible();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
