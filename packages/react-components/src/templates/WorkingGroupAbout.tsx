import { WorkingGroupResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { Card, Headline3, Paragraph, Subtitle } from '../atoms';
import { charcoal } from '../colors';
import { createMailTo } from '../mail';
import { Collapsible, CtaContactSection, TagList } from '../molecules';
import { DeliverablesCard, WorkingGroupMembers, RichText } from '../organisms';
import { perRem, smallDesktopScreen } from '../pixels';

type WorkingGroupAboutProps = {
  readonly showCollaborationCard: boolean;
  readonly membersListElementId: string;
} & Pick<
  WorkingGroupResponse,
  | 'description'
  | 'deliverables'
  | 'pointOfContact'
  | 'members'
  | 'leaders'
  | 'complete'
  | 'tags'
>;
const containerStyles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${33 / perRem}em`,
});

const tagListStyle = css({
  marginTop: `${12 / perRem}em`,
  marginBottom: `${24 / perRem}em`,
});

const getInTouchStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: `${24 / perRem}em`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    flexDirection: 'row',
  },
});

const WorkingGroupAbout: React.FC<WorkingGroupAboutProps> = ({
  showCollaborationCard,
  membersListElementId,
  description,
  deliverables,
  pointOfContact,
  members,
  leaders,
  complete,
  tags,
}) => (
  <div css={containerStyles}>
    <Card>
      <Headline3>Working Group Description</Headline3>
      <Collapsible>
        <RichText text={description} />
      </Collapsible>
    </Card>
    <DeliverablesCard deliverables={deliverables} />
    {!!tags.length && (
      <Card>
        <Headline3>Tags</Headline3>
        <div css={tagListStyle}>
          <Paragraph accent="lead">
            Explore keywords related to skills, techniques, resources, and
            tools.
          </Paragraph>
        </div>
        <TagList tags={tags} />
      </Card>
    )}
    {showCollaborationCard && (
      <Card accent="green">
        <Headline3>
          <span css={{ color: charcoal.rgb }}>
            Would you like to collaborate with this Working Group?
          </span>
        </Headline3>
        <Paragraph accent="lead">
          We are always looking for new people to collaborate with our working
          group to find the best solutions for our goals.
        </Paragraph>
        {pointOfContact && (
          <CtaContactSection
            href={createMailTo(pointOfContact.user.email)}
            buttonText={'Contact PM'}
            displayCopy
          />
        )}
      </Card>
    )}
    <section id={membersListElementId}>
      <WorkingGroupMembers
        leaders={leaders}
        members={members}
        isComplete={complete}
      />
    </section>
    {!complete && (
      <Card accent="green">
        <div css={getInTouchStyles}>
          <div css={{ display: 'flex', flexDirection: 'column' }}>
            <Subtitle noMargin>Have additional questions?</Subtitle>
            <div>The project manager is here to help.</div>
          </div>
          {pointOfContact && (
            <CtaContactSection
              href={createMailTo(pointOfContact.user.email)}
              buttonText={'Contact PM'}
              displayCopy
            />
          )}
        </div>
      </Card>
    )}
  </div>
);

export default WorkingGroupAbout;
