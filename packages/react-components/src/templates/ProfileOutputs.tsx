import { ResearchOutputAssociations } from '@asap-hub/model';
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
  association: ResearchOutputAssociations;
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
  association = 'Team',
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
    ) : (
      <NoOutputsPage
        title={`
          ${
            userAssociationMember ? 'Your' : 'This'
          } ${association.toLowerCase()} hasn’t shared any research ${
          association === 'Working Group' ? 'yet!' : '.'
        }`}
        description={
          <>
            {association === 'Team' && (
              <>
                {userAssociationMember
                  ? 'To start sharing research,'
                  : 'To learn more about this team’s work,'}{' '}
                <LinkConditional
                  href={
                    contactEmail ? createMailTo(contactEmail) : contactEmail
                  }
                >
                  {userAssociationMember ? 'contact your PM' : 'contact the PM'}
                </LinkConditional>
                .
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
