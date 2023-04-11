import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SharedResearchOutputBanner from '../SharedResearchOutputBanner';

describe('a newly published output', () => {
  it('displays the published now banner for a team or teams association', () => {
    const { queryByText, rerender } = render(
      <SharedResearchOutputBanner
        association="team"
        documentType="Article"
        published
      />,
    );
    expect(queryByText('Team Article published successfully.')).toBeVisible();
    rerender(
      <SharedResearchOutputBanner
        association="teams"
        documentType="Article"
        published
      />,
    );
    expect(queryByText('Team Article published successfully.')).toBeVisible();
  });

  it('displays the published now banner for a working group', () => {
    const { queryByText } = render(
      <SharedResearchOutputBanner
        association="working group"
        documentType="Article"
        published
      />,
    );
    expect(
      queryByText('Working Group Article published successfully.'),
    ).toBeVisible();
  });
  it('has a closable toast', () => {
    const { getByText, getByTitle } = render(
      <SharedResearchOutputBanner
        association="team"
        documentType="Article"
        published
      />,
    );
    const toast = getByText('Team Article published successfully.');
    expect(toast).toBeVisible();
    userEvent.click(getByTitle(/close/i));
    expect(toast).not.toBeInTheDocument();
  });
});

describe('a draft output', () => {
  it('shows the banner for a team association', () => {
    const { getByText } = render(
      <SharedResearchOutputBanner
        association="team"
        documentType="Article"
        published={false}
      />,
    );
    expect(
      getByText(
        'This draft is available to members in the team listed below. Only PMs can publish this output.',
      ),
    ).toBeVisible();
  });
  it('shows the banner for a teams association', () => {
    const { getByText } = render(
      <SharedResearchOutputBanner
        association="teams"
        documentType="Article"
        published={false}
      />,
    );
    expect(
      getByText(
        'This draft is available to members in the teams listed below. Only PMs can publish this output.',
      ),
    ).toBeVisible();
  });
  it('shows the banner for a working group association', () => {
    const { getByText } = render(
      <SharedResearchOutputBanner
        association="working group"
        documentType="Article"
        published={false}
      />,
    );
    expect(
      getByText(
        'This draft is available to members in the working group listed below. Only PMs can publish this output.',
      ),
    ).toBeVisible();
  });
});
