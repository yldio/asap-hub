import { css } from '@emotion/react';
import React, { ComponentProps } from 'react';
import { SharedResearchList } from '.';
import { LinkConditional } from '../atoms';
import { createMailTo } from '../mail';
import { perRem } from '../pixels';
import NoOutputsPage from './NoOutputsPage';

const containerStyles = css({
  padding: `${36 / perRem}em 0`,
});

export type ProfileOutputsProps = Omit<
  ComponentProps<typeof SharedResearchList>,
  'children'
> & {
  userAssociationMember: boolean;
  contactEmail?: string;
  workingGroupAssociation: boolean;
  draftOutputs?: boolean;
  hasOutputs: boolean;
};

const ProfileOutputs: React.FC<ProfileOutputsProps> = ({
  researchOutputs,
  numberOfItems,
  numberOfPages,
  currentPageIndex,
  renderPageHref,
  isListView,
  cardViewHref,
  exportResults,
  listViewHref,
  userAssociationMember,
  contactEmail,
  workingGroupAssociation,
  draftOutputs,
  hasOutputs,
}) => (
  <div css={containerStyles}>
    {numberOfItems ? (
      <SharedResearchList
        exportResults={exportResults}
        researchOutputs={researchOutputs}
        numberOfItems={numberOfItems}
        numberOfPages={numberOfPages}
        currentPageIndex={currentPageIndex}
        renderPageHref={renderPageHref}
        isListView={isListView}
        cardViewHref={cardViewHref}
        listViewHref={listViewHref}
      />
    ) : hasOutputs ? (
      <NoOutputsPage
        title="No results have been found."
        description="Please double-check your search for any typos or try a different search term."
        hideExploreButton
      />
    ) : draftOutputs ? (
      <NoOutputsPage
        title={`This ${
          workingGroupAssociation ? 'working group' : 'team'
        } doesn’t have any draft outputs.`}
        description={
          'To start sharing research, click on Share an Output button.'
        }
        hideExploreButton
      />
    ) : (
      <NoOutputsPage
        title={`
          ${userAssociationMember ? 'Your' : 'This'} ${
          workingGroupAssociation ? 'working group' : 'team'
        } hasn’t shared any research ${workingGroupAssociation ? 'yet!' : '.'}`}
        description={
          <>
            {!workingGroupAssociation && (
              <>
                {userAssociationMember
                  ? 'To start sharing research,'
                  : 'To learn more about this team’s work,'}
                <LinkConditional
                  href={
                    contactEmail ? createMailTo(contactEmail) : contactEmail
                  }
                >
                  {' '}
                  {userAssociationMember ? 'contact your PM' : 'contact the PM'}
                </LinkConditional>
                .{' '}
              </>
            )}
            In the meantime, try exploring research outputs shared by the
            network.
          </>
        }
      />
    )}
  </div>
);

export default ProfileOutputs;
