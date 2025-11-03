import { GrantInfo } from '@asap-hub/model';
import { css } from '@emotion/react';
import { useState } from 'react';

import { steel } from '../colors';
import { Card, Display, Link, Paragraph, TabButton } from '../atoms';
import { TabNav } from '../molecules';
import { rem } from '../pixels';

const tabsContainerStyles = css({
  display: 'flex',
  borderBottom: `1px solid ${steel.rgb}`,
});

const tabContentStyles = css({
  paddingTop: rem(20),
});

const buttonContainerStyles = css({
  marginTop: rem(24),
});

type ProjectDetailOverviewProps = {
  readonly originalGrant: GrantInfo;
  readonly supplementGrant?: GrantInfo;
};

type ProjectDetailOverviewContentProps = {
  title: string;
  description: string;
  proposalURL?: string;
};

const ProjectDetailOverviewContent: React.FC<
  ProjectDetailOverviewContentProps
> = ({ description, proposalURL }) => (
  <>
    <Paragraph accent="lead">{description}</Paragraph>
    {proposalURL ? (
      <div css={buttonContainerStyles}>
        <Link href={proposalURL} buttonStyle primary small>
          Read Full Proposal
        </Link>
      </div>
    ) : null}
  </>
);

export const tabs = ['Supplement Grant', 'Original Grant'] as const;

export type Tabs = (typeof tabs)[number];

const ProjectDetailOverview: React.FC<ProjectDetailOverviewProps> = ({
  originalGrant,
  supplementGrant,
}) => {
  const [selectedTab, setSelectedTab] = useState<Tabs>('Supplement Grant');

  return (
    <Card>
      <div>
        <Display styleAsHeading={3}>Overview</Display>

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
                <ProjectDetailOverviewContent
                  title={originalGrant.title}
                  description={originalGrant.description}
                  proposalURL={originalGrant.proposalURL}
                />
              ) : (
                <ProjectDetailOverviewContent
                  title={supplementGrant.title}
                  description={supplementGrant.description}
                  proposalURL={supplementGrant.proposalURL}
                />
              )}
            </div>
          </>
        ) : (
          <ProjectDetailOverviewContent
            title={originalGrant.title}
            description={originalGrant.description}
            proposalURL={originalGrant.proposalURL}
          />
        )}
      </div>
    </Card>
  );
};

export default ProjectDetailOverview;
