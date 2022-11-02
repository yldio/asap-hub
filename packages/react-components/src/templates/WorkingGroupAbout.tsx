import { TeamResponse } from '@asap-hub/model';
import { css } from '@emotion/react';

import { Card, Headline3, Link, Subtitle } from '../atoms';
import { createMailTo } from '../mail';
import { Collapsible } from '../molecules';
import { perRem } from '../pixels';

type WorkingGroupAboutProps = Pick<
  TeamResponse,
  'members' | 'pointOfContact'
> & {
  description: string;
};

const containerStyles = css({
  display: 'flex',
  flexFlow: 'column',
  gap: `${33 / perRem}em`,
});

const WorkingGroupAbout: React.FC<WorkingGroupAboutProps> = ({
  description,
  pointOfContact,
}) => (
  <div css={containerStyles}>
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
          href={`${createMailTo(pointOfContact.email)}`}
        >
          Contact PM
        </Link>
      )}
    </Card>
    <Card>
      <Headline3>Working Group Description</Headline3>
      <Collapsible>{description}</Collapsible>
    </Card>
    <Card accent="green">
      <Subtitle>Do you have any questions?</Subtitle>
      <div>Reach out to this working group if you need any support.</div>
      {pointOfContact && (
        <Link
          buttonStyle
          small
          primary
          href={`${createMailTo(pointOfContact.email)}`}
        >
          Contact PM
        </Link>
      )}
    </Card>
  </div>
);

export default WorkingGroupAbout;
