import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { useFlags } from '@asap-hub/react-context';
import { render, screen } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import userEvent from '@testing-library/user-event';
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
  const researchOutput = createResearchOutputResponse();

  const onCreateSpy = jest.fn();

  render(
    <TeamCreateOutputPage
      researchOutput={researchOutput}
      onCreate={onCreateSpy}
      suggestions={[]}
    />,
  );
  expect(
    screen.getByRole('heading', { name: /Share grant document/i }),
  ).toBeInTheDocument();
});
it('clicking button will trigger the callback', () => {
  const researchOutput = createResearchOutputResponse();

  const onCreateSpy = jest.fn();

  render(
    <TeamCreateOutputPage
      researchOutput={researchOutput}
      onCreate={onCreateSpy}
      suggestions={[]}
    />,
  );
  const button = screen.getByRole('button', { name: /Share/i });
  userEvent.click(button);
  expect(onCreateSpy).toHaveBeenCalled();
});
