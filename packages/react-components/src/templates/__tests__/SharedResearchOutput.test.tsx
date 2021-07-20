import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchOutput from '../SharedResearchOutput';

const props: ComponentProps<typeof SharedResearchOutput> = {
  ...createResearchOutputResponse(),
  type: 'Protocol',
  backHref: '#',
};
it('renders an output with title and content', () => {
  const { getByText } = render(
    <SharedResearchOutput
      {...props}
      type="Protocol"
      title="title"
      description="content"
    />,
  );
  expect(getByText(/protocol/i)).toBeVisible();
  expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
  expect(getByText(/content/i)).toBeVisible();
});

describe('tags and description', () => {
  it('handles tags and description omitted', () => {
    const { queryByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={[]} description="" />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
    expect(
      queryByText(/description/i, { selector: 'h2' }),
    ).not.toBeInTheDocument();
    expect(queryByRole('separator')).not.toBeInTheDocument();
  });

  it('handles just a description', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={[]} description="text" />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
    expect(queryByText(/description/i, { selector: 'h2' })).toBeInTheDocument();
    expect(getByText('text')).toBeVisible();
    expect(queryByRole('separator')).not.toBeInTheDocument();
  });

  it('handles just tags', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={['tag1']} description="" />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
    expect(
      queryByText(/description/i, { selector: 'h2' }),
    ).not.toBeInTheDocument();
    expect(getByText('tag1')).toBeVisible();
    expect(queryByRole('separator')).not.toBeInTheDocument();
  });
  it('handles tags and description', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput {...props} tags={['tag1']} description="text  " />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
    expect(queryByText(/description/i, { selector: 'h2' })).toBeInTheDocument();
    expect(getByText('tag1')).toBeVisible();
    expect(getByText('text')).toBeVisible();
    expect(queryByRole('separator')).toBeVisible();
  });
});

it('displays access instructions when data provided', () => {
  const { queryByText, getByText, rerender } = render(
    <SharedResearchOutput {...props} accessInstructions="" />,
  );
  expect(queryByText(/access instructions/i)).not.toBeInTheDocument();
  rerender(<SharedResearchOutput {...props} accessInstructions="Some Data" />);
  expect(getByText(/access instructions/i)).toBeVisible();
  expect(getByText(/some data/i)).toBeVisible();
});

it('displays contact pm card when there are contact emails', () => {
  const { queryByText, getByText, rerender } = render(
    <SharedResearchOutput {...props} pmsEmails={[]} />,
  );
  expect(queryByText(/contact pm/i)).not.toBeInTheDocument();
  rerender(<SharedResearchOutput {...props} pmsEmails={['blah@gmail.com']} />);
  expect(getByText(/contact pm/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/blah/i),
  );
});

describe('additional information', () => {
  it('contains the sharing status', () => {
    const { getByText } = render(
      <SharedResearchOutput {...props} sharingStatus="Network Only" />,
    );
    expect(getByText('Network Only')).toBeVisible();
  });

  it('contains the publication use status', () => {
    const { getByText, rerender } = render(
      <SharedResearchOutput {...props} usedInPublication />,
    );
    expect(getByText(/used in.+pub/i).closest('li')).toHaveTextContent(/yes/i);

    rerender(<SharedResearchOutput {...props} usedInPublication={false} />);
    expect(getByText(/used in.+pub/i).closest('li')).toHaveTextContent(/no/i);
  });
  it('omits the publication use status if unknown', () => {
    const { queryByText } = render(
      <SharedResearchOutput {...props} usedInPublication={undefined} />,
    );
    expect(queryByText(/used in.+pub/i)).not.toBeInTheDocument();
  });

  it('contains the ASAP funding status', () => {
    const { getByText, rerender } = render(
      <SharedResearchOutput {...props} asapFunded />,
    );
    expect(getByText(/asap.funded/i).closest('li')).toHaveTextContent(/yes/i);

    rerender(<SharedResearchOutput {...props} asapFunded={false} />);
    expect(getByText(/asap.funded/i).closest('li')).toHaveTextContent(/no/i);
  });
  it('omits the ASAP funding status if unknown', () => {
    const { queryByText } = render(
      <SharedResearchOutput {...props} asapFunded={undefined} />,
    );
    expect(queryByText(/asap.funded/i)).not.toBeInTheDocument();
  });
});
