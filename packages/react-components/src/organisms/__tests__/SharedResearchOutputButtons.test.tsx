import { ComponentProps } from 'react';
import { fireEvent, render } from '@testing-library/react';
import { ResearchOutputPermissionsContext } from '@asap-hub/react-context';

import SharedResearchOutputButtons from '../SharedResearchOutputButtons';

const props: ComponentProps<typeof SharedResearchOutputButtons> = {
  id: 'ro1',
  displayReviewModal: false,
  setDisplayReviewModal: jest.fn(),
  displayPublishModal: false,
  setDisplayPublishModal: jest.fn(),
  isInReview: false,
  duplicateLink: 'duplicateLink',
  published: false,
  checkForNewerManuscriptVersion: jest.fn(),
  isManuscriptOutputFlagEnabled: false,
};

it('displays edit button when user has permission', () => {
  const { queryByTitle, rerender } = render(
    <ResearchOutputPermissionsContext.Provider
      value={{
        canEditResearchOutput: false,
        canPublishResearchOutput: false,
        canShareResearchOutput: false,
      }}
    >
      <SharedResearchOutputButtons {...props} />,
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
      <SharedResearchOutputButtons {...props} />,
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
      <SharedResearchOutputButtons {...props} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(queryByTitle('Edit')).toBeInTheDocument();
});

it('does not display the edit button if someone requested a review and you are a non pm member', () => {
  const { queryByTitle } = render(
    <ResearchOutputPermissionsContext.Provider
      value={{
        canEditResearchOutput: true,
        canPublishResearchOutput: false,
        canShareResearchOutput: false,
      }}
    >
      <SharedResearchOutputButtons {...props} isInReview={true} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(queryByTitle('Edit')).toBeNull();
});

it('does display the edit button if someone requested a review and you are a pm member', () => {
  const { queryByTitle } = render(
    <ResearchOutputPermissionsContext.Provider
      value={{
        canEditResearchOutput: true,
        canPublishResearchOutput: true,
        canShareResearchOutput: false,
      }}
    >
      <SharedResearchOutputButtons {...props} isInReview={true} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(queryByTitle('Edit')).toBeInTheDocument();
});

it('displays duplicate button when user has permission', () => {
  const { queryByTitle, rerender } = render(
    <ResearchOutputPermissionsContext.Provider
      value={{
        canEditResearchOutput: false,
        canPublishResearchOutput: false,
        canShareResearchOutput: false,
        canDuplicateResearchOutput: false,
      }}
    >
      <SharedResearchOutputButtons {...props} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(queryByTitle('Duplicate')).toBeNull();

  rerender(
    <ResearchOutputPermissionsContext.Provider
      value={{
        canEditResearchOutput: false,
        canPublishResearchOutput: false,
        canShareResearchOutput: false,
        canDuplicateResearchOutput: false,
      }}
    >
      <SharedResearchOutputButtons {...props} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(queryByTitle('Duplicate')).toBeNull();

  rerender(
    <ResearchOutputPermissionsContext.Provider
      value={{
        canEditResearchOutput: true,
        canPublishResearchOutput: false,
        canShareResearchOutput: false,
        canDuplicateResearchOutput: true,
      }}
    >
      <SharedResearchOutputButtons {...props} />,
    </ResearchOutputPermissionsContext.Provider>,
  );
  expect(queryByTitle('Duplicate')).toBeInTheDocument();
});

describe('ready for review button', () => {
  it('does not get displayed when the user does not have permission', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
          canRequestReview: false,
        }}
      >
        <SharedResearchOutputButtons {...props} published={false} />,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Ready for PM Review')).toBeNull();
  });
  it('does not get displayed when the RO was published', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
          canRequestReview: true,
        }}
      >
        <SharedResearchOutputButtons {...props} published={true} />,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Ready for PM Review')).toBeNull();
  });
  it('does not get displayed when someone requested a review', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
          canRequestReview: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={false}
          isInReview={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Ready for PM Review')).toBeNull();
  });
  it('gets displayed when all the conditions are met and clicking it calls its function', async () => {
    const mockDisplayReviewModal = jest.fn();
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
          canRequestReview: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={false}
          setDisplayReviewModal={mockDisplayReviewModal}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Ready for PM Review');
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);
    expect(mockDisplayReviewModal).toHaveBeenCalled();
  });
});

describe('the switch to draft button', () => {
  it('does not get displayed when the user does not have permission', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
          canRequestReview: false,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={false}
          isInReview={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Switch to Draft')).toBeNull();
  });
  it('does not get displayed when the RO was published', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: true,
          canShareResearchOutput: false,
          canRequestReview: false,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={true}
          isInReview={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Switch to Draft')).toBeNull();
  });
  it('does not get displayed when did not request a review', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
          canRequestReview: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={false}
          isInReview={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Switch to Draft')).toBeNull();
  });
  it('gets displayed when all the conditions are met and clicking it calls its function', async () => {
    const mockDisplayReviewModal = jest.fn();
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: true,
          canShareResearchOutput: false,
          canRequestReview: false,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={false}
          setDisplayReviewModal={mockDisplayReviewModal}
          isInReview={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Switch to Draft');
    expect(button).toBeInTheDocument();
    fireEvent.click(button!);
    expect(mockDisplayReviewModal).toHaveBeenCalled();
  });
});

describe('the publish draft button', () => {
  it('does not get displayed when the user does not have staff permission', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: true,
          canPublishResearchOutput: false,
          canShareResearchOutput: false,
          canRequestReview: true,
        }}
      >
        <SharedResearchOutputButtons {...props} published={false} />,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Publish')).toBeNull();
  });
  it('does not get displayed when the RO was published', () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canEditResearchOutput: false,
          canPublishResearchOutput: true,
          canShareResearchOutput: false,
          canRequestReview: false,
        }}
      >
        <SharedResearchOutputButtons {...props} published={true} />,
      </ResearchOutputPermissionsContext.Provider>,
    );
    expect(queryByText('Publish')).toBeNull();
  });
  it('gets displayed when all the conditions are met and clicking it calls its function', async () => {
    const mockDisplayPublishModal = jest.fn();
    const { getByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canPublishResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={false}
          setDisplayPublishModal={mockDisplayPublishModal}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = getByText('Publish');
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(mockDisplayPublishModal).toHaveBeenCalled();
  });
});

describe('add version button', () => {
  it('is displayed when user has permissions and RO is published', async () => {
    const { getByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons {...props} published={true} />,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = getByText('Add Version');
    expect(button).toBeInTheDocument();
  });

  it('is not displayed when user has permissions and RO is not published', async () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons {...props} published={false} />,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Add Version');
    expect(button).toBeNull();
  });

  it('is not displayed when user does not have permissions', async () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: false,
        }}
      >
        <SharedResearchOutputButtons {...props} published={true} />,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Add Version');
    expect(button).toBeNull();
  });

  it('is not displayed when research output is linked to a manuscript', async () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={true}
          hasRelatedManuscript
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Add Version');
    expect(button).toBeNull();
  });
});

describe('import manuscript version button', () => {
  it('is displayed when flag is enabled and user has permissions and RO is published and RO is linked to manuscript', async () => {
    const { getByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={true}
          hasRelatedManuscript
          isManuscriptOutputFlagEnabled
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = getByText('Import Manuscript Version');
    expect(button).toBeInTheDocument();
  });

  it('is not displayed when flag is disabled', async () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          isManuscriptOutputFlagEnabled={false}
          published={true}
          hasRelatedManuscript
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Import Manuscript Version');
    expect(button).toBeNull();
  });
  it('is not displayed when RO is not published', async () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={false}
          hasRelatedManuscript
          isManuscriptOutputFlagEnabled={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Import Manuscript Version');
    expect(button).toBeNull();
  });

  it('is not displayed when user does not have permissions', async () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: false,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={true}
          hasRelatedManuscript
          isManuscriptOutputFlagEnabled={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Import Manuscript Version');
    expect(button).toBeNull();
  });

  it('is not displayed when RO is not linked to a manuscript', async () => {
    const { queryByText } = render(
      <ResearchOutputPermissionsContext.Provider
        value={{
          canVersionResearchOutput: true,
        }}
      >
        <SharedResearchOutputButtons
          {...props}
          published={true}
          hasRelatedManuscript={false}
          isManuscriptOutputFlagEnabled={true}
        />
        ,
      </ResearchOutputPermissionsContext.Provider>,
    );

    const button = queryByText('Import Manuscript Version');
    expect(button).toBeNull();
  });
});
