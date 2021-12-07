import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { createResearchOutputResponse } from '@asap-hub/fixtures';

import SharedResearchOutput from '../SharedResearchOutput';

const props: ComponentProps<typeof SharedResearchOutput> = {
  ...createResearchOutputResponse(),
  backHref: '#',
};
describe('Grant Documents', () => {
  it('renders an output with title and content', () => {
    const { getByText } = render(
      <SharedResearchOutput
        {...props}
        type="Grant Document"
        title="title"
        description="content"
      />,
    );
    expect(getByText(/grant document/i)).toBeVisible();
    expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
    expect(getByText(/content/i)).toBeVisible();
  });

  it('handles tags and separate RTF description', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput
        {...props}
        type="Grant Document"
        tags={['tag1']}
        description="abc 123"
      />,
    );
    expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
    expect(
      queryByText(/description/i, { selector: 'h2' }),
    ).not.toBeInTheDocument();
    expect(getByText('tag1')).toBeVisible();
    expect(getByText('abc 123')).toBeVisible();
    expect(queryByRole('separator')).not.toBeInTheDocument();
  });

  it('does not display additional information when data provided', () => {
    const { queryByText } = render(
      <SharedResearchOutput
        {...props}
        type="Grant Document"
        usedInPublication={true}
      />,
    );
    expect(queryByText(/additional information/i)).not.toBeInTheDocument();
  });
});

describe('Not Grant Documents', () => {
  it('displays access instructions when data provided', () => {
    const { queryByText, getByText, rerender } = render(
      <SharedResearchOutput {...props} type="Article" accessInstructions="" />,
    );
    expect(queryByText(/access instructions/i)).not.toBeInTheDocument();
    rerender(
      <SharedResearchOutput
        {...props}
        type="Article"
        accessInstructions="Some Data"
      />,
    );
    expect(getByText(/access instructions/i)).toBeVisible();
    expect(getByText(/some data/i)).toBeVisible();
  });
  describe('tags and description', () => {
    it('handles tags and description omitted', () => {
      const { queryByText, queryByRole } = render(
        <SharedResearchOutput
          {...props}
          type="Article"
          tags={[]}
          description=""
        />,
      );
      expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).not.toBeInTheDocument();
      expect(queryByRole('separator')).not.toBeInTheDocument();
    });

    it('handles just a description', () => {
      const { queryByText, getByText, queryByRole } = render(
        <SharedResearchOutput
          {...props}
          type="Article"
          tags={[]}
          description="text"
        />,
      );
      expect(queryByText(/tags/i, { selector: 'h2' })).not.toBeInTheDocument();
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).toBeInTheDocument();
      expect(getByText('text')).toBeVisible();
      expect(queryByRole('separator')).not.toBeInTheDocument();
    });

    it('handles just tags', () => {
      const { queryByText, getByText, queryByRole } = render(
        <SharedResearchOutput
          {...props}
          type="Article"
          tags={['tag1']}
          description=""
        />,
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
        <SharedResearchOutput
          {...props}
          type="Article"
          tags={['tag1']}
          description="text"
        />,
      );
      expect(queryByText(/tags/i, { selector: 'h2' })).toBeInTheDocument();
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).toBeInTheDocument();
      expect(getByText('tag1')).toBeVisible();
      expect(getByText('text')).toBeVisible();
      expect(queryByRole('separator')).toBeVisible();
    });
  });
});

it('displays contact pm card when there are contact emails', () => {
  const { queryByText, getByText, rerender } = render(
    <SharedResearchOutput {...props} contactEmails={[]} />,
  );
  expect(queryByText(/contact pm/i)).not.toBeInTheDocument();
  rerender(
    <SharedResearchOutput {...props} contactEmails={['blah@gmail.com']} />,
  );
  expect(getByText(/contact pm/i).closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/blah/i),
  );
});
