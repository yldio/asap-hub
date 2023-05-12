import { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createResearchOutputResponse } from '@asap-hub/fixtures';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';
import { researchOutputDocumentTypes } from '@asap-hub/model';

import SharedResearchOutput from '../SharedResearchOutput';

const props: ComponentProps<typeof SharedResearchOutput> = {
  ...createResearchOutputResponse(),
  descriptionMD: '',
  methods: [],
  subtype: undefined,
  environments: [],
  organisms: [],
  backHref: '#',
  publishedNow: false,
};
describe('Grant Documents', () => {
  it('renders an output with title and content', () => {
    const { getByText } = render(
      <SharedResearchOutput
        {...props}
        documentType="Grant Document"
        title="title"
        description="content"
      />,
    );
    expect(getByText(/grant document/i)).toBeVisible();
    expect(getByText(/title/i, { selector: 'h1' })).toBeVisible();
    expect(getByText(/content/i)).toBeVisible();
  });

  it('displays edit button when user has permission', () => {
    const { queryByTitle, rerender } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
        }}
      >
        <SharedResearchOutput {...props} documentType="Article" />,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByTitle('Edit')).toBeNull();

    rerender(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
        }}
      >
        <SharedResearchOutput {...props} documentType="Grant Document" />,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByTitle('Edit')).toBeNull();

    rerender(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: true,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
        }}
      >
        <SharedResearchOutput {...props} documentType="Article" />,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByTitle('Edit')).toBeInTheDocument();
  });

  it('handles tags and separate RTF description', () => {
    const { queryByText, getByText, queryByRole } = render(
      <SharedResearchOutput
        {...props}
        documentType="Grant Document"
        keywords={['tag1']}
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
        documentType="Grant Document"
        usedInPublication={true}
      />,
    );
    expect(queryByText(/additional information/i)).not.toBeInTheDocument();
  });
});

describe('Not Grant Documents', () => {
  it('displays access instructions when data provided', () => {
    const { queryByText, getByText, rerender } = render(
      <SharedResearchOutput {...props} documentType="Article" usageNotes="" />,
    );
    expect(queryByText(/access instructions/i)).not.toBeInTheDocument();
    rerender(
      <SharedResearchOutput
        {...props}
        documentType="Article"
        usageNotes="Some Data"
      />,
    );
    expect(getByText(/usage notes/i)).toBeVisible();
    expect(getByText(/some data/i)).toBeVisible();
  });
  describe('tags and description', () => {
    it('handles tags and description omitted', () => {
      const { queryByText, queryByRole } = render(
        <SharedResearchOutput
          {...props}
          documentType="Article"
          keywords={[]}
          description=""
          descriptionMD=""
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
          documentType="Article"
          keywords={[]}
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

    it('handles no description', () => {
      const { queryByText } = render(
        <SharedResearchOutput
          {...props}
          documentType="Article"
          keywords={['tag1']}
          description={undefined}
          descriptionMD={undefined}
        />,
      );
      expect(
        queryByText(/description/i, { selector: 'h2' }),
      ).not.toBeInTheDocument();
    });
    it('handles just tags', () => {
      const { queryByText, getByText, queryByRole } = render(
        <SharedResearchOutput
          {...props}
          documentType="Article"
          keywords={['tag1']}
          description=""
          descriptionMD=""
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
          documentType="Article"
          keywords={['tag1']}
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
    it('only display descriptionMD if it is set', () => {
      const { queryByText, getByText, queryByRole } = render(
        <SharedResearchOutput
          {...props}
          documentType="Article"
          keywords={['tag1']}
          description="should not be there"
          descriptionMD="should be visible"
        />,
      );
      expect(getByText('should be visible')).toBeVisible();
      expect(queryByText('should not be there')).not.toBeInTheDocument();
      expect(queryByRole('separator')).toBeVisible();
    });
    it('displays the related research card when data provided', () => {
      const { queryByText, getByText, rerender } = render(
        <SharedResearchOutput
          {...props}
          documentType="Article"
          relatedResearch={[]}
        />,
      );
      expect(queryByText(/Related Research/i)).not.toBeInTheDocument();

      rerender(
        <SharedResearchOutput
          {...props}
          documentType="Article"
          relatedResearch={[
            {
              id: 'id1',
              title: 'Related research article',
              teams: [{ id: 'team1', displayName: 'team 1' }],
              type: 'Published',
              documentType: 'Article',
            },
          ]}
        />,
      );
      expect(getByText('Related Research')).toBeVisible();
      expect(
        getByText(
          'Find out all shared research outputs that contributed to this one.',
        ),
      ).toBeVisible();
      expect(getByText(/Related research article/i)).toBeVisible();
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

it('merges different tag types in the correct order', () => {
  const { getAllByRole } = render(
    <SharedResearchOutput
      {...props}
      methods={['method']}
      organisms={['organisms']}
      environments={['environment']}
      subtype={'subtype'}
      keywords={['tag']}
      teams={[]}
      labs={[]}
      authors={[]}
      workingGroups={undefined}
    />,
  );
  expect(
    getAllByRole('listitem')
      .map(({ textContent }) => textContent)
      .slice(3),
  ).toEqual(['method', 'organisms', 'environment', 'subtype', 'tag']);
});

describe('a draft output', () => {
  it('can never display the published now banner for a draft', () => {
    const { queryByText } = render(
      <SharedResearchOutput
        {...props}
        published={false}
        publishedNow={true}
        teams={[{ id: 'team1', displayName: 'team 1' }]}
        workingGroups={undefined}
      />,
    );
    expect(
      queryByText('Team Article published successfully.'),
    ).not.toBeInTheDocument();
  });
  it('shows the toast for team drafts that contain only one team', () => {
    const { getByText } = render(
      <SharedResearchOutput
        {...props}
        published={false}
        teams={[{ id: 'team1', displayName: 'team 1' }]}
        workingGroups={undefined}
      />,
    );
    expect(
      getByText(
        'This draft is available to members in the team listed below. Only PMs can publish this output.',
      ),
    ).toBeVisible();
    expect(getByText('Draft')).toBeVisible();
  });
  it('shows the toast for team drafts that contain more than one teams', () => {
    const { getByText } = render(
      <SharedResearchOutput
        {...props}
        published={false}
        teams={[
          { id: 'team1', displayName: 'team 1' },
          { id: 'team2', displayName: 'team 2' },
        ]}
        workingGroups={undefined}
      />,
    );
    expect(
      getByText(
        'This draft is available to members in the teams listed below. Only PMs can publish this output.',
      ),
    ).toBeVisible();
    expect(getByText('Draft')).toBeVisible();
  });
  it('shows the toast for team drafts that contain a working group', () => {
    const { getByText } = render(
      <SharedResearchOutput
        {...props}
        published={false}
        teams={[{ id: 'team1', displayName: 'team 1' }]}
        workingGroups={[
          {
            id: 'wg1',
            title: 'wg 1',
          },
        ]}
      />,
    );
    expect(
      getByText(
        'This draft is available to members in the working group listed below. Only PMs can publish this output.',
      ),
    ).toBeVisible();
    expect(getByText('Draft')).toBeVisible();
  });
});

describe('a newly published output', () => {
  it('has a closable toast', () => {
    const { getByText, getByTitle } = render(
      <SharedResearchOutput
        {...props}
        teams={[{ id: 'team1', displayName: 'team 1' }]}
        workingGroups={undefined}
        documentType="Article"
        published={true}
        publishedNow
      />,
    );
    const toast = getByText('Team Article published successfully.');
    expect(toast).toBeVisible();
    userEvent.click(getByTitle(/close/i));
    expect(toast).not.toBeInTheDocument();
  });
  it.each(researchOutputDocumentTypes)(
    'shows the toast for team outputs with documentType: %s',
    (researchOutputDocumentType) => {
      const { getByText } = render(
        <SharedResearchOutput
          {...props}
          teams={[{ id: 'team1', displayName: 'team 1' }]}
          workingGroups={undefined}
          documentType={researchOutputDocumentType}
          published={true}
          publishedNow
        />,
      );
      expect(
        getByText(`Team ${researchOutputDocumentType} published successfully.`),
      ).toBeVisible();
    },
  );
  it.each(researchOutputDocumentTypes)(
    'shows the toast for working group outputs with documentType: %s',
    (researchOutputDocumentType) => {
      const { getByText } = render(
        <SharedResearchOutput
          {...props}
          teams={[{ id: 'team1', displayName: 'team 1' }]}
          workingGroups={[
            {
              id: 'wg1',
              title: 'wg 1',
            },
          ]}
          documentType={researchOutputDocumentType}
          published={true}
          publishedNow
        />,
      );
      expect(
        getByText(
          `Working Group ${researchOutputDocumentType} published successfully.`,
        ),
      ).toBeVisible();
    },
  );
});
