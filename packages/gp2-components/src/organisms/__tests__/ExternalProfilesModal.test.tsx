import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import ExternalProfilesModal from '../ExternalProfilesModal';

describe('ExternalProfilesModal', () => {
  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  beforeEach(jest.resetAllMocks);
  type ExternalProfilesModalProps = ComponentProps<
    typeof ExternalProfilesModal
  >;
  const defaultProps: ExternalProfilesModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
  };

  const renderExternalProfiles = (
    overrides: Partial<ExternalProfilesModalProps> = {},
  ) =>
    render(<ExternalProfilesModal {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderExternalProfiles();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'External Profiles' }),
    );
  });

  it('renders external profiles', () => {
    renderExternalProfiles();
    expect(
      screen.getByRole('textbox', {
        name: 'Google Scholar (optional) Type your Google Scholar profile URL.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'ORCID (optional) Type your ORCID ID.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'Research Gate (optional) Type your Research Gate profile URL.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'ResearcherID (optional) Type your Researcher ID.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'Blog (optional)',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'Twitter (optional) Type your Twitter profile URL.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'LinkedIn (optional) Type your LinkedIn profile URL.',
      }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', {
        name: 'Github (optional) Type your Github profile URL.',
      }),
    ).toBeVisible();
  });

  it('calls onSave with the right arguments', async () => {
    const onSave = jest.fn();
    const social = {};
    renderExternalProfiles({
      social,
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).toHaveBeenCalledWith({
      social,
    });
    await waitFor(() => expect(getSaveButton()).toBeEnabled());
  });

  it.each`
    name               | input                                          | field                                                                | value
    ${'googleScholar'} | ${'https://scholar.google.com/test_scholar'}   | ${'Google Scholar (optional) Type your Google Scholar profile URL.'} | ${undefined}
    ${'orcid'}         | ${'1234-1234-1234-1234'}                       | ${'ORCID (optional) Type your ORCID ID.'}                            | ${'https://orcid.org/1234-1234-1234-1234'}
    ${'researchGate'}  | ${'https://researchid.com/rid/1234-1234-1234'} | ${'Research Gate (optional) Type your Research Gate profile URL.'}   | ${undefined}
    ${'researcherId'}  | ${'R-1234-1234'}                               | ${'ResearcherID (optional) Type your Researcher ID.'}                | ${'https://researcherid.com/rid/R-1234-1234'}
    ${'blog'}          | ${'https://www.blogger.com'}                   | ${'Blog (optional)'}                                                 | ${undefined}
    ${'twitter'}       | ${'https://twitter.com/YLD.io'}                | ${'Twitter (optional) Type your Twitter profile URL.'}               | ${undefined}
    ${'linkedIn'}      | ${'https://www.linkedin.com/test_linkedIn'}    | ${'LinkedIn (optional) Type your LinkedIn profile URL.'}             | ${undefined}
    ${'github'}        | ${'https://github.com/test_github'}            | ${'Github (optional) Type your Github profile URL.'}                 | ${undefined}
  `(
    'calls onSave with the updated field $name',
    async ({ name, input, field, value = input }) => {
      const onSave = jest.fn();
      renderExternalProfiles({
        social: {},
        onSave,
      });

      userEvent.type(
        screen.getByRole('textbox', {
          name: field,
        }),
        input,
      );

      userEvent.click(getSaveButton());
      expect(onSave).toHaveBeenCalledWith({
        social: {
          [name]: value,
        },
      });

      await waitFor(() => expect(getSaveButton()).toBeEnabled());
    },
  );
});
