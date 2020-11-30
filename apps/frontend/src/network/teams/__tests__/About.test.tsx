import React from 'react';
import { render } from '@testing-library/react';
import { createTeamResponse } from '@asap-hub/fixtures';

import About from '../About';

describe('the proposal', () => {
  it('is not rendered when there is no proposal', async () => {
    const { queryByText } = render(
      <About team={{ ...createTeamResponse(), proposalURL: undefined }} />,
    );
    expect(queryByText(/proposal/i)).not.toBeInTheDocument();
  });

  it('is rendered with a library href', async () => {
    const { getByText } = render(
      <About team={{ ...createTeamResponse(), proposalURL: 'someproposal' }} />,
    );
    expect(getByText(/proposal/i).closest('a')?.href).toMatch(/someproposal$/);
  });
});
