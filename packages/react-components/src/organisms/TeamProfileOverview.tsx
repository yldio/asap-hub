import { TeamResponse } from '@asap-hub/model';
import { sharedResearch } from '@asap-hub/routing';
import { css } from '@emotion/react';
import { useState } from 'react';

import { steel } from '..';
import { Card, Display, Divider, Headline2, Headline3, Link, Paragraph, TabButton } from '../atoms';
import { TabNav, TagList } from '../molecules';
import { mobileScreen, rem } from '../pixels';

const tabsContainerStyles = css({
  display: 'flex',
  borderBottom: `1px solid ${steel.rgb}}`,
});

const tabContentStyles = css({
  paddingTop: rem(20),
});

const stretchOnMobile = css({
  [`@media (max-width: ${mobileScreen.width}px)`]: {
    display: 'flex',
    justifyContent: 'stretch',
  },
});

const dividerStyles = css({
  marginTop: rem(24),
  marginBottom: rem(24),
});

const contentStyles = css({
  paddingTop: rem(20),
});

type TeamProfileOverviewProps = Pick<
  TeamResponse,
  'projectTitle' | 'projectSummary' | 'proposalURL' | 'supplementGrant' | 'tags'
> & {
  readonly proposalURL?: string;
};

type TeamProfileOverviewContentProps = {
  title: TeamResponse['projectTitle'];
  description: TeamResponse['projectSummary'];
  researchOutputURL?: string;
};
const TeamProfileOverviewContent: React.FC<TeamProfileOverviewContentProps> = ({
  title,
  description,
  researchOutputURL,
}) => (
  <>
    <Headline2 styleAsHeading={4}>{title}</Headline2>
    <Paragraph>{description}</Paragraph>
    {researchOutputURL ? (
      <div css={stretchOnMobile}>
        <Link
          buttonStyle
          primary
          href={
            sharedResearch({}).researchOutput({
              researchOutputId: researchOutputURL,
            }).$
          }
        >
          Read Full Proposal
        </Link>
      </div>
    ) : null}
  </>
);

export const tabs = ['Supplement Grant', 'Original Grant'] as const;

export type Tabs = (typeof tabs)[number];

const TeamProfileOverview: React.FC<TeamProfileOverviewProps> = ({
  projectSummary,
  projectTitle,
  proposalURL,
  supplementGrant,
  tags,
}) => {
  const [selectedTab, setSelectedTab] = useState<Tabs>('Supplement Grant');

  return (
    <Card>
      <div>
        <Display styleAsHeading={3}>Project Overview</Display>

        {supplementGrant?.title ? (
          <>
            <div css={tabsContainerStyles}>
              <TabNav>
                {tabs.map((tab) => (
                  <TabButton
                    key={tab}
                    active={selectedTab === tab}
                    onClick={() => {
                      setSelectedTab(tab);
                    }}
                  >
                    {tab}
                  </TabButton>
                ))}
              </TabNav>
            </div>

            <div css={tabContentStyles}>
              {selectedTab === 'Original Grant' ? (
                <TeamProfileOverviewContent
                  title={projectTitle}
                  description={projectSummary}
                  researchOutputURL={proposalURL}
                />
              ) : (
                <TeamProfileOverviewContent
                  title={supplementGrant.title}
                  description={supplementGrant.description}
                  researchOutputURL={supplementGrant.proposalURL}
                />
              )}
            </div>
          </>
        ) : (
          <>
          <TeamProfileOverviewContent
            title={projectTitle}
            description={projectSummary}
            researchOutputURL={proposalURL}
          />
         
          
    {tags && tags.length ? (
      <>
       <Divider css={dividerStyles} />
        <Headline3 noMargin>Tags</Headline3>
        <Paragraph accent="lead">
          Explore keywords related to skills, techniques, resources, and tools.
        </Paragraph>
        <div css={contentStyles}>
          <TagList tags={tags.map(({ name }) => name)} />
        </div>
      </>
    ) : null}
          </>
        )}
      </div>
    </Card>
  );
};

export default TeamProfileOverview;
