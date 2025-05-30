import { ResearchOutputSharingStatus } from '@asap-hub/model';
import { render, screen, fireEvent } from '@testing-library/react';

import ResearchOutputFormSharingCard from '../ResearchOutputFormSharingCard';

describe('Changelog validation', () => {
  const defaultProps = {
    link: '',
    title: '',
    descriptionMD: '',
    shortDescription: '',
    changelog: '',
    sharingStatus: 'Network Only' as ResearchOutputSharingStatus,
    subtype: '',
    displayChangelog: true,
    isSaving: false,
    asapFunded: 'No' as const,
    usedInPublication: 'No' as const,
    researchTags: [],
    typeOptions: [],
    getShortDescriptionFromDescription: jest.fn(),
    onChangeLink: jest.fn(),
    onChangeTitle: jest.fn(),
    onChangeDescription: jest.fn(),
    onChangeShortDescription: jest.fn(),
    onChangeChangelog: jest.fn(),
    onChangeType: jest.fn(),
    onChangeSubtype: jest.fn(),
    onChangeAsapFunded: jest.fn(),
    onChangeUsedInPublication: jest.fn(),
    onChangeSharingStatus: jest.fn(),
    onChangePublishDate: jest.fn(),
  };

  it('shows validation message when changelog is empty', async () => {
    render(<ResearchOutputFormSharingCard {...defaultProps} />);

    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: '  ' } });
    fireEvent.blur(changelogInput);

    expect(screen.getByText('Please enter a changelog')).toBeInTheDocument();
  });

  it('shows validation message when changelog exceeds 250 characters', async () => {
    render(<ResearchOutputFormSharingCard {...defaultProps} />);

    const longText = 'a'.repeat(251);
    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: longText } });
    fireEvent.blur(changelogInput);

    expect(
      await screen.findByText(
        'The changelog exceeds the character limit. Please limit it to 250 characters.',
      ),
    ).toBeInTheDocument();
  });

  it('clears validation message when changelog is valid', async () => {
    render(<ResearchOutputFormSharingCard {...defaultProps} />);

    const validText = 'a'.repeat(100);
    const changelogInput = screen.getByRole('textbox', { name: /changelog/i });
    fireEvent.change(changelogInput, { target: { value: validText } });
    fireEvent.blur(changelogInput);

    expect(
      screen.queryByText('Please enter a changelog'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(
        'The changelog exceeds the character limit. Please limit it to 250 characters.',
      ),
    ).not.toBeInTheDocument();
  });
});
