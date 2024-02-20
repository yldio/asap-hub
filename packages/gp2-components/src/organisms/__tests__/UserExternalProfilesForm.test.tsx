import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';

import UserExternalProfilesForm from '../UserExternalProfilesForm';

describe('UserExternalProfilesForm', () => {
  beforeEach(jest.resetAllMocks);
  const mockOnChange = jest.fn();

  type UserExternalProfilesFormProps = ComponentProps<
    typeof UserExternalProfilesForm
  >;

  const defaultProps: UserExternalProfilesFormProps = {
    ...gp2Fixtures.createUserResponse(),
    onChange: mockOnChange,
    isSaving: false,
  };

  const renderExternalProfiles = (
    overrides: Partial<UserExternalProfilesFormProps> = {},
  ) =>
    render(<UserExternalProfilesForm {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a heading with the right title', () => {
    renderExternalProfiles();
    expect(
      screen.getByRole('heading', { name: 'External Profiles' }),
    ).toBeInTheDocument();
  });

  it.each(['Research Networks', 'Social Networks'])(
    'renders the %s section',
    (section) => {
      renderExternalProfiles();
      expect(screen.getByText(section)).toBeInTheDocument();
    },
  );

  it('disables all fields when isSaving is true', () => {
    renderExternalProfiles({ isSaving: true });

    const inputNames = [
      'Google Scholar (optional) Type your Google Scholar profile URL.',
      'ORCID (optional) Type your ORCID ID.',
      'Research Gate (optional) Type your Research Gate profile URL.',
      'ResearcherID (optional) Type your Researcher ID.',
      'Blog (optional)',
      'BlueSky (optional) Type your BlueSky profile URL.',
      'Threads (optional) Type your Threads profile URL.',
      'X (optional) Type your X (formerly twitter) profile URL.',
      'LinkedIn (optional) Type your LinkedIn profile URL.',
      'Github (optional) Type your Github profile URL.',
    ];
    inputNames.forEach((name) => {
      const input = screen.getByRole('textbox', { name });
      expect(input).toBeVisible();
      expect(input).toBeDisabled();
    });
  });

  it.each`
    fieldName          | name
    ${'googleScholar'} | ${'Google Scholar (optional) Type your Google Scholar profile URL.'}
    ${'orcid'}         | ${'ORCID (optional) Type your ORCID ID.'}
    ${'researchGate'}  | ${'Research Gate (optional) Type your Research Gate profile URL.'}
    ${'researcherId'}  | ${'ResearcherID (optional) Type your Researcher ID.'}
    ${'blog'}          | ${'Blog (optional)'}
    ${'blueSky'}       | ${'BlueSky (optional) Type your BlueSky profile URL.'}
    ${'threads'}       | ${'Threads (optional) Type your Threads profile URL.'}
    ${'twitter'}       | ${'X (optional) Type your X (formerly twitter) profile URL.'}
    ${'linkedIn'}      | ${'LinkedIn (optional) Type your LinkedIn profile URL.'}
    ${'github'}        | ${'Github (optional) Type your Github profile URL.'}
  `('disables input $fieldName field when isSaving is true', ({ name }) => {
    renderExternalProfiles({ isSaving: true });
    const input = screen.getByRole('textbox', { name });
    expect(input).toBeVisible();
    expect(input).toBeDisabled();
  });

  it.each`
    name               | placeholder                                              | value
    ${'googleScholar'} | ${'https://scholar.google.com/citations?user=profileID'} | ${'https://scholar.google.com/citations?user=1234'}
    ${'orcid'}         | ${'0000-0000-0000-0000'}                                 | ${'1111-2222-3333-4444'}
    ${'researchGate'}  | ${'https://www.researchgate.net/profile/profileID'}      | ${'https://www.researchgate.net/profile/1234'}
    ${'researcherId'}  | ${'0-0000-0000'}                                         | ${'E-1234-2024'}
    ${'blog'}          | ${'https://www.example.com'}                             | ${'https://www.blog.com'}
    ${'blueSky'}       | ${'https://bsky.app/profile/yourprofilename'}            | ${'https://bsky.app/profile/1234'}
    ${'threads'}       | ${'https://www.threads.net/@yourprofilename'}            | ${'https://www.threads.net/@1234'}
    ${'twitter'}       | ${'https://twitter.com/yourprofilename'}                 | ${'https://twitter.com/1234'}
    ${'linkedIn'}      | ${'https://www.linkedin.com/in/yourprofilename'}         | ${'https://www.linkedin.com/in/1234'}
    ${'github'}        | ${'https://github.com/yourprofilename'}                  | ${'https://github.com/1234'}
  `(
    'calls onSave with the updated $name field',
    async ({ name, placeholder, value }) => {
      renderExternalProfiles({
        social: {},
        isSaving: false,
      });

      const input = screen.getByPlaceholderText(placeholder);
      expect(input).toBeVisible();
      expect(input).toBeEnabled();

      fireEvent.change(input, { target: { value } });

      expect(mockOnChange).toHaveBeenCalledWith({
        [name]: value,
      });
    },
  );
});
