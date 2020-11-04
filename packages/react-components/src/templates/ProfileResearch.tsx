import React, { ComponentProps } from 'react';
import css from '@emotion/css';
import { UserResponse } from '@asap-hub/model';

import {
  perRem,
  tabletScreen,
  vminLinearCalc,
  mobileScreen,
  largeDesktopScreen,
} from '../pixels';
import {
  ProfileBackground,
  ProfileSkills,
  QuestionsSection,
} from '../organisms';
import { CtaCard } from '../molecules';
import { createMailTo } from '../mail';
import { Link } from '../atoms';
import { editIcon } from '../icons';

const styles = css({
  // compensate for cards having more bottom than top padding (see below)
  paddingTop: `${24 / perRem}em`,
  paddingBottom: `${12 / perRem}em`,

  display: 'grid',
  gridTemplate: `
    repeat(4, [edit] minmax(${12 / perRem}em, auto) [card] auto)
  / [card edit] auto
  `,

  [`@media (min-width: ${tabletScreen.width}px)`]: {
    gridTemplate: `
      repeat(4, [card edit] auto)
    / [none] ${36 / perRem}em [card] auto [edit] ${36 / perRem}em
    `,
    gridColumnGap: vminLinearCalc(
      mobileScreen,
      24,
      largeDesktopScreen,
      30,
      'px',
    ),
  },
});
const cardStyles = css({
  // bottom only to separate from the pencil belonging to the next card
  paddingBottom: `${24 / perRem}em`,
  [`@media (min-width: ${tabletScreen.width}px)`]: {
    // top to align with pencil on the side
    paddingTop: `${12 / perRem}em`,
  },
});
const editButtonStyles = css({
  justifySelf: 'end',
});

type ProfileResearchProps = ComponentProps<typeof QuestionsSection> &
  ComponentProps<typeof ProfileSkills> &
  Pick<ComponentProps<typeof ProfileBackground>, 'firstName' | 'displayName'> &
  Pick<UserResponse, 'email'> & {
    readonly teams: ReadonlyArray<
      Omit<ComponentProps<typeof ProfileBackground>, 'firstName'>
    >;
  } & {
    editBackgroundHref?: string;
    editSkillsHref?: string;
    editQuestionsHref?: string;
  };

const ProfileResearch: React.FC<ProfileResearchProps> = ({
  firstName,
  displayName,
  email,
  teams,
  skills,
  skillsDescription,
  questions,

  editBackgroundHref,
  editSkillsHref,
  editQuestionsHref,
}) => {
  return (
    <div css={styles}>
      <div css={[cardStyles, { gridArea: '1 card / card' }]}>
        {teams.length
          ? teams.map((team) => (
              <ProfileBackground
                key={team.id}
                {...team}
                firstName={firstName}
              />
            ))
          : null}
      </div>
      <div css={[editButtonStyles, { gridArea: '1 edit / edit' }]}>
        {editBackgroundHref && (
          <Link
            buttonStyle
            small
            primary
            href={editBackgroundHref}
            label="Edit role on ASAP"
          >
            {editIcon}
          </Link>
        )}
      </div>
      <div css={[cardStyles, { gridArea: '2 card / card' }]}>
        {skills.length ? (
          <ProfileSkills
            skillsDescription={skillsDescription}
            skills={skills}
          />
        ) : null}
      </div>
      <div css={[editButtonStyles, { gridArea: '2 edit / edit' }]}>
        {editSkillsHref && (
          <Link
            buttonStyle
            small
            primary
            href={editSkillsHref}
            label="Edit expertise and resources"
          >
            {editIcon}
          </Link>
        )}
      </div>
      <div css={[cardStyles, { gridArea: '3 card / card' }]}>
        {questions.length ? (
          <QuestionsSection firstName={firstName} questions={questions} />
        ) : null}
      </div>
      <div css={[editButtonStyles, { gridArea: '3 edit / edit' }]}>
        {editQuestionsHref && (
          <Link
            buttonStyle
            small
            primary
            href={editQuestionsHref}
            label="Edit open questions"
          >
            {editIcon}
          </Link>
        )}
      </div>
      <div css={[cardStyles, { gridArea: '4 card / card' }]}>
        <CtaCard href={createMailTo(email)} buttonText="Contact">
          <strong>Interested in what you have seen?</strong> <br />
          Why not get in touch with {displayName}?
        </CtaCard>
      </div>
    </div>
  );
};

// TODO edit tests
export default ProfileResearch;
