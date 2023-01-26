import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { Keyword } from '@asap-hub/model/src/gp2';
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
    keywords        | expected
    ${undefined}    | ${'Start typing...'}
    ${['Genetics']} | ${'Genetics'}
  `('renders keywords with value "$expected"', ({ keywords, expected }) => {
    renderModal({ keywords });
    const textbox = screen.getByRole('textbox', {
      name: /Keywords/i,
    });
    expect(textbox).toBeVisible();
    expect(screen.getByText(expected)).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const keywords = ['Genetics'] as Keyword[];
    renderModal({
      keywords,
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      keywords,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('calls onSave with the updated fields', async () => {
    const onSave = jest.fn();
    const keywords = 'Genetics';
    renderModal({
      keywords: [],
      onSave,
    });

    userEvent.click(
      screen.getByRole('textbox', {
        name: /Keywords/i,
      }),
    );
    userEvent.click(screen.getByText(keywords));

    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      keywords: [keywords],
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it('shows validation message', async () => {
    const onSave = jest.fn();
    renderModal({
      keywords: [],
      onSave,
    });

    userEvent.click(getSaveButton());
    expect(onSave).not.toHaveBeenCalled();
    expect(screen.getByText('Please add your keywords')).toBeVisible();
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });
});
