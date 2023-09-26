import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import KeywordsModal from '../KeywordsModal';

describe('KeywordsModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type KeywordsModalProps = ComponentProps<typeof KeywordsModal>;
  const defaultProps: KeywordsModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
    suggestions: [{ name: 'Keyword-2', id: 'id-2' }],
  };

  const renderModal = (overrides: Partial<KeywordsModalProps> = {}) =>
    render(
      <StaticRouter>
        <KeywordsModal {...defaultProps} {...overrides} />
      </StaticRouter>,
    );

  it('renders a dialog with the right title', () => {
    renderModal();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Keywords' }),
    );
  });

  it.each`
    keywords                              | expected
    ${undefined}                          | ${'Start typing...'}
    ${[{ id: 'id-1', name: 'Genetics' }]} | ${'Genetics'}
  `('renders keywords with value "$expected"', ({ keywords, expected }) => {
    renderModal({ tags: keywords });
    const textbox = screen.getByRole('textbox', {
      name: /Keywords/i,
    });
    expect(textbox).toBeVisible();
    expect(screen.getByText(expected)).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const tags = [
      { id: 'id-1', name: 'Genetics' },
    ] as gp2Model.KeywordDataObject[];
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
        name: /Keywords/i,
      }),
    );
    userEvent.click(screen.getByText('Keyword-2'));

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
    expect(screen.getByText('Please add your keywords')).toBeVisible();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
