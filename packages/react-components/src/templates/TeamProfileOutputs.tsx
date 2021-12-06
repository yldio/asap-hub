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

export type TeamProfileOutputsProps = Omit<
  ComponentProps<typeof SharedResearchList>,
  'children'
> & {
  ownTeam: boolean;
  hasOutputs: boolean;
  contactEmail?: string;
};

const TeamProfileOutputs: React.FC<TeamProfileOutputsProps> = ({
  researchOutputs,
  numberOfItems,
  numberOfPages,
  currentPageIndex,
  renderPageHref,
  isListView,
  cardViewHref,
  exportResults,
  listViewHref,
  hasOutputs,
  ownTeam,
  contactEmail,
}) => (
  <div css={containerStyles}>
    {hasOutputs ? (
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
    ) : ownTeam ? (
      <NoOutputsPage
        title="Your team hasn’t shared any research."
        description={
          <>
            To start sharing research,{' '}
            <LinkConditional
              href={contactEmail ? createMailTo(contactEmail) : contactEmail}
            >
              contact your PM
            </LinkConditional>
            . In the meantime, try exploring research outputs shared by the
            network.
          </>
        }
      />
    ) : (
      <NoOutputsPage
        title="This team hasn’t shared any research."
        description={
          <>
            To learn more about this team’s work,{' '}
            <LinkConditional
              href={contactEmail ? createMailTo(contactEmail) : contactEmail}
            >
              contact the PM
            </LinkConditional>
            . In the meantime, try exploring research outputs shared by the
            network.
          </>
        }
      />
    )}
  </div>
);

export default TeamProfileOutputs;
