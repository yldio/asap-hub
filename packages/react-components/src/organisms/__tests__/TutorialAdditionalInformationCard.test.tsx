import { createTutorialsResponse } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import TutorialAdditionalInformationCard from '../TutorialAdditionalInformationCard';

const props: ComponentProps<typeof TutorialAdditionalInformationCard> = {
  ...createTutorialsResponse({ key: 'Test Tutorial' }),
};
it('contains the sharing status', () => {
  const { getByText } = render(
    <TutorialAdditionalInformationCard
      {...props}
      sharingStatus="Network Only"
    />,
  );
  expect(getByText('Network Only')).toBeVisible();
});

it('contains the publication use status', () => {
  const { getByText, rerender } = render(
    <TutorialAdditionalInformationCard {...props} usedInPublication />,
  );
  expect(getByText(/used in.+pub/i).closest('li')).toHaveTextContent(/yes/i);

  rerender(
    <TutorialAdditionalInformationCard {...props} usedInPublication={false} />,
  );
  expect(getByText(/used in.+pub/i).closest('li')).toHaveTextContent(/no/i);
});
it('omits the publication use status if unknown', () => {
  const { queryByText } = render(
    <TutorialAdditionalInformationCard
      {...props}
      usedInPublication={undefined}
    />,
  );
  expect(queryByText(/used in.+pub/i)).not.toBeInTheDocument();
});

it('contains the ASAP funding status', () => {
  const { getByText, rerender } = render(
    <TutorialAdditionalInformationCard {...props} asapFunded />,
  );
  expect(getByText(/asap.funded/i).closest('li')).toHaveTextContent(/yes/i);

  rerender(<TutorialAdditionalInformationCard {...props} asapFunded={false} />);
  expect(getByText(/asap.funded/i).closest('li')).toHaveTextContent(/no/i);
});
it('omits the ASAP funding status if unknown', () => {
  const { queryByText } = render(
    <TutorialAdditionalInformationCard {...props} asapFunded={undefined} />,
  );
  expect(queryByText(/asap.funded/i)).not.toBeInTheDocument();
});
