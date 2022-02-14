import { useFlags } from '@asap-hub/react-context';
import { waitFor } from '@testing-library/dom';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
import { StaticRouter } from 'react-router-dom';

import TeamCreateOutputPage from '../TeamCreateOutputPage';

beforeEach(() => {
  const {
    result: {
      current: { disable },
    },
  } = renderHook(useFlags);

  disable('ROMS_FORM');
});
it('renders the research output type in the header', () => {
  const onCreateSpy = jest.fn();

  render(
    <StaticRouter>
      <TeamCreateOutputPage
        type="Grant Document"
        onSave={onCreateSpy}
        tagSuggestions={[]}
      />
    </StaticRouter>,
  );
  expect(screen.getByRole('heading', { name: /Share/i })).toBeInTheDocument();
});
it('clicking button will trigger the callback', () => {
  const onCreateSpy = jest.fn();

  render(
    <StaticRouter>
      <TeamCreateOutputPage
        type="Grant Document"
        onSave={onCreateSpy}
        tagSuggestions={[]}
      />
    </StaticRouter>,
  );
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
  waitFor(() => expect(onCreateSpy).toHaveBeenCalled());
});
