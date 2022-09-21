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

const containerStyles = css({
  display: 'flex',
  flexDirection: 'column',
  gap: rem(32),
  padding: `${rem(32)} 0 ${rem(48)}`,
});

const contentStyles = css({
  marginTop: rem(32),
});

const WorkingGroupOverview: React.FC<WorkingGroupOverviewProps> = ({
  description,
  primaryEmail,
  secondaryEmail,
  members,
}) => (
  <div css={containerStyles}>
    <Card>
      <Headline3 noMargin>Description</Headline3>
      <div css={contentStyles}>
        <ExpandableText>{description}</ExpandableText>
      </div>
    </Card>
    <Card>
      <Headline3 noMargin>Contact Information</Headline3>
      <div css={contentStyles}>
        <EmailSection
          contactEmails={[
            { email: primaryEmail, contact: 'WG Email' },
            { email: secondaryEmail, contact: 'Lead Email' },
          ]}
        />
      </div>
    </Card>
    {!!members.length && (
      <Card>
        <Headline3
          noMargin
        >{`Working Group Members (${members.length})`}</Headline3>
        <div css={contentStyles}>
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
        </div>
      </Card>
    )}
  </div>
);

export default WorkingGroupOverview;
