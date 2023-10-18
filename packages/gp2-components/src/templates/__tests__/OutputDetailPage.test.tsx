import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render } from '@testing-library/react';

import OutputDetailPage from '../OutputDetailPage';

describe('OutputDetailPage', () => {
  it('displays edit button if user is administrator', () => {
    const { queryByTitle } = render(
      <OutputDetailPage
        isAdministrator
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(queryByTitle('Edit')).toBeInTheDocument();
  });

  it('does not display edit button if user is not administrator', () => {
    const { queryByTitle } = render(
      <OutputDetailPage
        isAdministrator={false}
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(queryByTitle('Edit')).not.toBeInTheDocument();
  });

  it('displays contact support footer', () => {
    const { getByText } = render(
      <OutputDetailPage
        isAdministrator
        {...gp2Fixtures.createOutputResponse()}
      />,
    );
    expect(getByText('Have additional questions?')).toBeInTheDocument();
    expect(
      getByText('Reach out to tech support if you need help.'),
    ).toBeInTheDocument();

    expect(getByText('Contact Tech Support')).toBeInTheDocument();
    expect(getByText('Contact Tech Support').closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/techsupport@gp2.org/i),
    );
  });
});
