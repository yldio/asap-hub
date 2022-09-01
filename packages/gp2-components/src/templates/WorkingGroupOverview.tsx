import { WorkingGroupResponse } from '@asap-hub/model/src/gp2';
import {
  Card,
  Headline3,
  MembersList,
  pixels,
} from '@asap-hub/react-components';

import { css } from '@emotion/react';
import ExpandableText from '../molecules/ExpandableText';
import EmailSection from '../organisms/EmailSection';

type WorkingGroupOverviewProps = Pick<
  WorkingGroupResponse,
  'members' | 'description' | 'primaryEmail' | 'secondaryEmail'
>;

const { rem } = pixels;

const WorkingGroupOverview: React.FC<WorkingGroupOverviewProps> = ({
  description,
  primaryEmail,
  secondaryEmail,
  members,
}) => (
  <div
    css={css({
      display: 'flex',
      flexDirection: 'column',
      gap: rem(32),
      padding: `${rem(32)} 0 ${rem(48)}`,
    })}
  >
    <Card>
      <Headline3>Description</Headline3>
      <ExpandableText>{description}</ExpandableText>
    </Card>
    <Card>
      <Headline3>Contact Information</Headline3>
      <EmailSection
        contactEmails={[
          { email: primaryEmail, contact: 'WG Email' },
          { email: secondaryEmail, contact: 'Lead Email' },
        ]}
      />
    </Card>
    {members.length ? (
      <Card>
        <Headline3>{`Working Group Members (${members.length})`}</Headline3>
        <MembersList
          members={members.map(
            ({ role, firstName, lastName, avatarUrl, userId: id }) => ({
              firstLine: `${firstName} ${lastName}`,
              secondLine: role,
              avatarUrl,
              firstName,
              lastName,
              id,
            }),
          )}
        />
      </Card>
    ) : null}
  </div>
);

export default WorkingGroupOverview;
