import { render } from '@testing-library/react';
import { createEventResponse } from '@asap-hub/fixtures';
import SpeakersList from '../SpeakersList';

it('renders the speakers list', async () => {
  const { getByText } = render(<SpeakersList {...createEventResponse()} />);

  expect(getByText('The team one')).toBeVisible();
  expect(getByText('To be announced')).toBeVisible();
});
