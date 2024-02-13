import { WorkingGroupResponse } from '@asap-hub/model';
import { css } from '@emotion/react';
import { activePrimaryBackgroundColorDefault, colors } from '..';

import {
  Card,
  CopyButton,
  Headline3,
  Link,
  Paragraph,
  Subtitle,
} from '../atoms';
import { charcoal } from '../colors';
import { createMailTo } from '../mail';
import { Collapsible, TagList } from '../molecules';
import { DeliverablesCard, WorkingGroupMembers, RichText } from '../organisms';
import { perRem, smallDesktopScreen, tabletScreen } from '../pixels';

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

const copyButtonStyles = css({
  backgroundColor: 'inherit',
  borderColor: activePrimaryBackgroundColorDefault.rgba,
  ':hover, :focus': {
    borderColor: colors.info500.rgb,
  },
  path: {
    fill: colors.fern.rgb,
  },
});

const contactStyles = css({
  display: 'flex',
  gap: `${8 / perRem}em`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    alignSelf: 'center',
  },
})

const buttonStyles = css({
  display: 'flex',
  flexGrow: 1,
  [`@media (min-width: ${tabletScreen.min}px)`]: {
    flexGrow: 'unset',
  },
})

const getInTouchStyles = css({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: `${24 / perRem}em`,
  [`@media (min-width: ${smallDesktopScreen.min}px)`]: {
    flexDirection: 'row'
  },
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
    {!complete && (<Card accent="green">
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
        <div css={contactStyles}>
          <div css={buttonStyles}>
            <Link
              buttonStyle
              small
              primary
              href={`${createMailTo(pointOfContact.user.email)}`}
              noMargin
            >
              Contact PM
            </Link>
          </div>
          <CopyButton
            hoverTooltipText="Copy Email"
            clickTooltipText="Email Copied"
            onClick={() =>
              navigator.clipboard.writeText(pointOfContact.user.email)
            }
            overrideStyles={copyButtonStyles}
          />
        </div>
      )}
    </Card>)}
    <section id={membersListElementId}>
      <WorkingGroupMembers
        leaders={leaders}
        members={members}
        isComplete={complete}
      />
    </section>
    <Card accent="green">
      <div css={getInTouchStyles}>
        <div css={{display: 'flex', flexDirection: 'column'}}>
        <Subtitle noMargin>Have additional questions?</Subtitle>
        <div>The project manager is here to help.</div>
        </div>
        {pointOfContact && (
          <div css={contactStyles}>
            <div css={{display: 'flex', flexGrow: 1}}>
            <Link
              buttonStyle
              small
              primary
              href={`${createMailTo(pointOfContact.user.email)}`}
              noMargin
            >
              Contact PM
            </Link>
            </div>
            <CopyButton
              hoverTooltipText="Copy Email"
              clickTooltipText="Email Copied"
              onClick={() =>
                navigator.clipboard.writeText(pointOfContact.user.email)
              }
              overrideStyles={copyButtonStyles}
            />
          </div>
        )}
      </div>
    </Card>
  </div>
);

export default WorkingGroupAbout;
