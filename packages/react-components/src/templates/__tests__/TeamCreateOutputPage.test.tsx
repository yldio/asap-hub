import { createTeamResponse } from '@asap-hub/fixtures';
import { useFlags } from '@asap-hub/react-context';
import { waitFor } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import TeamCreateOutputPage from '../TeamCreateOutputPage';

const props: ComponentProps<typeof TeamCreateOutputPage> = {
  onSave: jest.fn(),
  documentType: 'Grant Document',
  tagSuggestions: [],
  team: createTeamResponse(),
  getResearchTags: jest.fn(),
};
beforeEach(() => {
  const {
    result: {
      current: { disable },
    },
  } = renderHook(useFlags);

  disable('ROMS_FORM');
});
it('renders the research output type in the header', () => {
  render(
    <StaticRouter>
      <TeamCreateOutputPage {...props} />
    </StaticRouter>,
  );
  expect(screen.getByRole('heading', { name: /Share/i })).toBeInTheDocument();
});
it('clicking button will trigger the callback', () => {
  const mockOnCreate = jest.fn();

  render(
    <StaticRouter>
      <TeamCreateOutputPage {...props} onSave={mockOnCreate} />
    </StaticRouter>,
  );
  const button = screen.getByRole('button', { name: /Publish/i });
  userEvent.click(button);
  waitFor(() => expect(mockOnCreate).toHaveBeenCalled());
});
