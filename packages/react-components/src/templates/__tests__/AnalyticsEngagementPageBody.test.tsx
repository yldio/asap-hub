import { render } from '@testing-library/react';
import { ComponentProps } from 'react';
import { AnalyticsEngagementPageBody } from '..';

describe('AnalyticsEngagementPageBody', () => {
  const props: ComponentProps<typeof AnalyticsEngagementPageBody> = {
    numberOfPages: 1,
    currentPageIndex: 0,
    renderPageHref: () => '',
  };
  it('renders', () => {
    const { getByText } = render(<AnalyticsEngagementPageBody {...props} />);

    expect(getByText('Representation of Presenters')).toBeInTheDocument();
  });
});
