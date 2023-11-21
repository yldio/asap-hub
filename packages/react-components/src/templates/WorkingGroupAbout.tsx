import { WorkingGroupResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Card, Headline3, Link, Paragraph, Subtitle } from '../atoms';
import { createMailTo } from '../mail';
import { Collapsible, TagList } from '../molecules';
import { DeliverablesCard, WorkingGroupMembers, RichText } from '../organisms';
import { perRem } from '../pixels';

type WorkingGroupAboutProps = {
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

const WorkingGroupAbout: React.FC<WorkingGroupAboutProps> = ({
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
    <DeliverablesCard deliverables={deliverables} />
    <Card accent="green">
      <Headline3>
        Would you like to collaborate with this Working Group?
      </Headline3>
      <div>
        We are always looking for new people to collaborate with our working
        group to find the best solutions for our goals.
      </div>
      {pointOfContact && (
        <Link
          buttonStyle
          small
          primary
          href={`${createMailTo(pointOfContact.user.email)}`}
        >
          Contact PM
        </Link>
      )}
    </Card>
    <Card>
      <Headline3>Working Group Description</Headline3>
      <Collapsible>
        <RichText text={description} />
      </Collapsible>
    </Card>
    {tags.length ? (
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
    ) : null}
    <section id={membersListElementId}>
      <WorkingGroupMembers
        leaders={leaders}
        members={members}
        isComplete={complete}
      />
    </section>
    <Card accent="green">
      <Subtitle>Do you have any questions?</Subtitle>
      <div>Reach out to this working group if you need any support.</div>
      {pointOfContact && (
        <Link
          buttonStyle
          small
          primary
          href={`${createMailTo(pointOfContact.user.email)}`}
        >
          Contact PM
        </Link>
      )}
    </Card>
  </div>
);

export default WorkingGroupAbout;
